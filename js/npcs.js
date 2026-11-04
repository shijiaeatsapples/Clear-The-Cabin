
function followWithCamera(target) {
  camPos(clamp(target.pos.x, width() / 2, BG_WIDTH - width() / 2), height() / 2)
}

function isNearDoor(x) {
  return DOORS.some((doorX) => Math.abs(x - doorX) < CLEAR_DIST)
}

function isInQueueZone(x) {
  return QUEUE_ZONES.some((zone) => x >= zone.from && x <= zone.to)
}

function unclearedNpcs() {
  return get("npc").filter((npc) => !npc.record.cleared)
}

function nearestNpc(npcs, x) {
  return closest(npcs, (npc) => Math.abs(npc.pos.x - x))
}

function playAnim(character, anim) {
  if (character.curAnim() !== anim) character.play(anim)
}

function walkToward(npc, targetX, speed) {
  const dx = targetX - npc.pos.x
  if (Math.abs(dx) > 1) {
    npc.pos.x += Math.sign(dx) * Math.min(speed * dt(), Math.abs(dx))
    npc.flipX = dx < 0
    playAnim(npc, "walk")
    return false
  }
  playAnim(npc, "idle")
  return true
}

function pickRoamX(fromX) {
  if (rand() < ROAM_IDLE_CHANCE) return fromX
  for (let i = 0; i < 10; i++) {
    const x = rand(MIN_X, MAX_X)
    if (!isNearDoor(x)) return x
  }
  return fromX
}

function rollReturnToDoor(npc, crowd) {
  npc.returnWait -= dt()
  if (npc.returnWait > 0 || round.closing) return false
  
  if (allCleared(crowd)) return false

  npc.returnWait = RETURN_CHECK_TIME
  if (rand() >= returnChance(round.level) * (1 - currentLuck(save.equipped, round.level))) return false

  npc.record.cleared = false
  return true
}

function seatNpc(npc) {
  const { record } = npc
  if (Math.abs(npc.pos.x - record.chairX) > CHAIR_DROP_RANGE) return false

  record.seated = true
  save.seaterHintSeen = true
  record.x = record.chairX
  record.y = SEATED_Y
  npc.pos = vec2(record.x, record.y)
  npc.z = SEATED_Y
  npc.play(SIT_ANIM)
  npc.unuse("shader")
  return true
}

function queueNpc(npc) {
  if (!isInQueueZone(npc.pos.x)) return false

  npc.record.x = npc.pos.x
  return true
}

function releaseNpcToRoam(npc) {
  if (isNearDoor(npc.pos.x)) return false

  npc.roamX = npc.pos.x
  npc.roamWait = rand(2, 5)
  return true
}

function placeDroppedNpc(npc, queueNpcs) {
  if (isSeater(npc.record)) return seatNpc(npc)
  if (queueNpcs) return queueNpc(npc)
  return releaseNpcToRoam(npc)
}

function clearNpc(npc) {
  npc.returnWait = RETURN_CHECK_TIME
  npc.record.cleared = true
  coinSound()
  if (!npc.record.paid) {
    const coins = coinsForClear(totalCleared())
    save.currency += coins
    round.coinsEarned += coins
    npc.record.paid = true
}
}
