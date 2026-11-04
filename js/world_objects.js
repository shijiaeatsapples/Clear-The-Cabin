// ============================================================================
// Game world: objects
// ============================================================================

function addPlayer(playerX, stats) {
  return add([
    sprite(save.equipped, { anim: "idle" }),
    pos(playerX, PLAYER_Y),
    scale(0.5 * stats.sizeFix),
    anchor("bot"),
    z(500),
  ])
}

function addMoveIcon(name, x) {
  return add([
    sprite(name),
    pos(x, MOVE_ICON_Y),
    anchor("center"),
    scale(MOVE_ICON_SCALE),
    // the images have see-through margins, so only the arrow itself is pressable
    area({ scale: vec2(0.55, 0.9) }),
    opacity(MOVE_ICON_IDLE_OPACITY),
    fixed(),
    z(1000),
    "moveIcon",
  ])
}

function isOverMoveIcon() {
  return get("moveIcon").some((icon) => icon.isHovering())
}

function addDoors() {
  DOORS.forEach((doorX, i) => {
    add([
      rect(DOOR_WIDTH, FLOOR_Y - DOOR_TOP),
      pos(doorX, FLOOR_Y),
      anchor("bot"),
      opacity(0),
      area(),
      "door",
      { doorIndex: i },
    ])
  })
}

function addNpcs(crowd) {
  crowd.forEach((record) => {
    const npc = add([
      sprite(record.spriteName, { anim: record.seated ? SIT_ANIM : "idle" }),
      pos(record.x, record.y),
      color(255, 255, 255),
      scale(0.45),
      anchor("bot"),
      area(),
      z(record.y),
      "npc",
      {
        record,
        crowdX: record.crowdX,
        roamX: record.x,
        roamWait: rand(1, 3),
        returnWait: RETURN_CHECK_TIME,
      },
    ])

    if (isSeater(record) && !record.seated) npc.use(shader("seaterOutline"))
  })
}

function addChairHighlight(record) {
  const chairTop = CHAIR_Y - CHAIR_HEIGHT / 2

  const chairGlow = add([
    rect(CHAIR_WIDTH, CHAIR_HEIGHT, { radius: 6 }),
    pos(record.chairX, CHAIR_Y),
    anchor("center"),
    color(...HIGHLIGHT_YELLOW),
    opacity(0.5),
    z(-0.4),
  ])

  const chairArrow = add([
    sprite("chair_arrow"),
    pos(record.chairX, chairTop),
    anchor("bot"),
    z(900),
  ])

  chairGlow.onUpdate(() => {
    if (record.seated) {
      chairGlow.destroy()
      chairArrow.destroy()
      return
    }
    chairGlow.opacity = wave(0.35, 0.75, time() * 5)
    chairArrow.pos.y = chairTop - wave(0, 8, time() * 5)
  })
}

function addSeaterHint() {
  const { box, label } = addMessageBox(SEATER_HINT, 600)
  box.onUpdate(() => {
    if (!save.seaterHintSeen) return
    box.destroy()
    label.destroy()
  })
}
