
function canEnterDoor(world, door) {
  const blocked = unclearedNpcs().some((npc) => Math.abs(npc.pos.x - door.pos.x) < CLEAR_DIST)
  const inRange = Math.abs(world.player.pos.x - door.pos.x) <= DOOR_RANGE
  return !round.closing && world.canExit() && !blocked && inRange
}

function clickDoorAt(world, mouse) {
  const door = get("door").find((d) => d.hasPoint(mouse))
  if (!door) return

  if (canEnterDoor(world, door)) {
    go(world.exitTo, { playerX: door.pos.x })
  } else {
    shake(2)
  }
}

function grabNpc(world, hit, mouse) {
  const { player, stats } = world

  if (Math.abs(hit.pos.x - player.pos.x) > stats.grabRange) {
    shake(4)
    world.stunTimer = 0.1
    return
  }

  const extras = unclearedNpcs()
    .filter((npc) => npc !== hit && Math.abs(npc.pos.x - hit.pos.x) < MULTI_GRAB_RADIUS)
    .sort((a, b) => Math.abs(a.pos.x - hit.pos.x) - Math.abs(b.pos.x - hit.pos.x))
    .slice(0, stats.maxDrag - 1)

  world.dragged = [hit, ...extras]
  world.dragged.forEach((npc) => {
    npc.dragOffsetX = npc.pos.x - mouse.x
    npc.play("idle")
  })
}

function setupDragging(world) {
  onMousePress(() => {
    // a press on a movement icon must not also grab an NPC or click a door behind it
    if (round.closing || isOverMoveIcon()) return

    const mouse = toWorld(mousePos())
    const hit = unclearedNpcs()
      .filter((npc) => npc.hasPoint(mouse))
      .sort((a, b) => b.z - a.z)[0]

    if (hit) {
      grabNpc(world, hit, mouse)
    } else {
      clickDoorAt(world, mouse)
    }
  })

  onMouseRelease(() => {
    if (world.dragged.length === 0) return

    world.dragged.forEach((npc) => {
      if (placeDroppedNpc(npc, world.queueNpcs)) clearNpc(npc)
    })
    writeSave()
    world.dragged = []
  })
}

function setupCursor(world) {
  onUpdate(() => {
    const mouse = toWorld(mousePos())

    if (world.dragged.length > 0) {
      setCursor("grabbing")
    } else if (isOverMoveIcon()) {
      setCursor("pointer")
    } else if (unclearedNpcs().some((npc) => npc.hasPoint(mouse))) {
      setCursor("grab")
    } else if (get("door").some((d) => d.hasPoint(mouse) && canEnterDoor(world, d))) {
      setCursor("pointer")
    } else {
      setCursor("default")
    }
  })
}

function updateDraggedNpc(npc) {
  const targetX = clamp(toWorld(mousePos()).x + npc.dragOffsetX, MIN_X, MAX_X)
  const maxStep = dragSpeed(save.equipped, round.level) * dt()
  npc.pos.x += clamp(targetX - npc.pos.x, -maxStep, maxStep)
}

function updateClearedNpc(world, npc) {
  if (npc.record.seated || rollReturnToDoor(npc, world.crowd) || world.queueNpcs) return

  if (npc.roamWait > 0) {
    npc.roamWait -= dt()
    playAnim(npc, "idle")
  } else if (walkToward(npc, npc.roamX, ROAM_SPEED)) {
    npc.roamX = pickRoamX(npc.pos.x)
    npc.roamWait = rand(2, 5)
  }
  npc.record.x = npc.pos.x
}

function setupNpcMovement(world) {
  onUpdate("npc", (npc) => {
    if (world.dragged.includes(npc)) {
      updateDraggedNpc(npc)
    } else if (npc.record.cleared) {
      updateClearedNpc(world, npc)
    } else {
      walkToward(npc, npc.crowdX, NPC_SPEED)
    }
  })
}

function setupRoundTimer(world) {
  onUpdate(() => {
    if (round.level === 1 || !round.trainArrived || round.closing) return

    round.timeLeft -= dt()
    if (round.timeLeft <= DOOR_SOUND_TIME) doorClosingSounds()
    if (round.timeLeft > 0 && peopleLeft() > 0) return

    round.closing = true
    go("game_inside", { playerX: world.player.pos.x })
  })
}


function setupCrowdArrow(world) {
  const { player } = world

  const crowdArrow = add([
    sprite("arrow"),
    pos(player.pos),
    anchor("center"),
    z(900),
    opacity(0),
  ])

  onUpdate(() => {
    const targets = unclearedNpcs().filter((npc) => !world.dragged.includes(npc))
    const active = round.trainArrived && !round.closing && round.timeLeft <= ARROW_TIME && targets.length > 0
    crowdArrow.opacity = active ? 1 : 0
    if (!active) return

    const dx = nearestNpc(targets, player.pos.x).pos.x - player.pos.x
    if (Math.abs(dx) > ARROW_DEAD_ZONE) crowdArrow.flipX = dx < 0
    crowdArrow.pos = vec2(player.pos.x, player.pos.y - ARROW_HEIGHT)
  })
}


//PLAYER MOVEMENT
function setupPlayerMovement(world) {
  const { player } = world

  const leftIcon = addMoveIcon("moveLeft", MOVE_ICON_LEFT_X)
  const rightIcon = addMoveIcon("moveRight", MOVE_ICON_RIGHT_X)

  // the press has to start on an icon: sliding onto one while dragging doesn't count
  let pressStartedOnIcon = false
  onMousePress(() => { pressStartedOnIcon = isOverMoveIcon() })
  onMouseRelease(() => { pressStartedOnIcon = false })
  const isIconHeld = (icon) => pressStartedOnIcon && icon.isHovering()

  onUpdate(() => {
    const leftPressed = isKeyDown("left") || isKeyDown("a") || isIconHeld(leftIcon) || isMoveHeld(-1)
    const rightPressed = isKeyDown("right") || isKeyDown("d") || isIconHeld(rightIcon) || isMoveHeld(1)
    let dir = 0

    if (world.stunTimer > 0) {
      world.stunTimer -= dt()
    } else if (!round.closing) {
      if (leftPressed) dir -= 1
      if (rightPressed) dir += 1
    }

    setFootsteps(dir !== 0)

    leftIcon.opacity = leftPressed ? 1 : MOVE_ICON_IDLE_OPACITY
    rightIcon.opacity = rightPressed ? 1 : MOVE_ICON_IDLE_OPACITY

    player.pos.x = clamp(player.pos.x + dir * playerSpeed(save.equipped) * dt(), MIN_X, MAX_X)

    if (dir !== 0) player.flipX = dir < 0
    playAnim(player, dir !== 0 ? "walk" : "idle")

    followWithCamera(player)
  })

  onSceneLeave(() => setFootsteps(false))
}

function addGameWorld({ background, exitTo, playerX = width() / 2, canExit = () => true, queueNpcs = false }) {
  addBackground(background)

  const stats = PLAYERS[save.equipped]
  const crowd = round.crowds[background]
  const player = addPlayer(playerX, stats)
  const world = { player, stats, crowd, exitTo, canExit, queueNpcs, dragged: [], stunTimer: 0 }

  addCurrencyHUD()
  addRoundHUD()
  addPlayerStatsHUD()

  add([
    sprite("logo"),
    pos(width() / 2, 40),
    anchor("center"),
    scale(0.1),
    fixed(),
  ])

  if (exitTo) addDoors()
  addNpcs(crowd)
  crowd.filter((record) => isSeater(record) && !record.seated).forEach(addChairHighlight)

  if (!save.seaterHintSeen && !round.closing && crowd.some(isSeater)) addSeaterHint()

  setupDragging(world)
  setupCursor(world)
  setupNpcMovement(world)
  setupRoundTimer(world)
  setupCrowdArrow(world)
  setupPlayerMovement(world)

  // last, so the tutorial's skip button can override the cursor set above
  if (round.level === 1 && !round.closing) addTutorial(background, player)
}
