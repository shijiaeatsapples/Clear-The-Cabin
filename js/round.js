// ============================================================================
// Round state
// ============================================================================

// kept outside the scenes so NPCs and the timer survive moving between them
const round = {
  level: 1,
  timeLeft: ROUND_TIME,
  doorSoundsPlayed: false,
  trainArrived: false,
  closing: false,
  clearedBefore: 0,
  teleportsUsed: 0,
  tutorialStep: TUTORIAL_STEP.NONE,
  crowds: {},
}

function isSeater(record) {
  return record.chairX !== undefined
}

function allCleared(crowd) {
  return crowd.every((record) => record.cleared)
}

function closest(items, distanceOf) {
  return items.reduce((a, b) => (distanceOf(b) < distanceOf(a) ? b : a))
}

function makeCrowd() {
  return DOORS.flatMap((doorX) =>
    Array.from({ length: NPCS_PER_DOOR }, (_, i) => {
      const crowdX = doorX + (i - (NPCS_PER_DOOR - 1) / 2) * CROWD_SPACING
      return {
        spriteName: choose(NPC_SPRITES),
        crowdX,
        x: crowdX,
        y: FLOOR_Y + rand(-6, 6),
        cleared: false,
        paid: false,
      }
    })
  )
}

function addChairNpcs(crowd, count) {
  const freeChairs = [...CHAIRS]
  const shuffled = [...crowd].sort(() => rand() - 0.5)

  shuffled.slice(0, count).forEach((record) => {
    const nearest = closest(freeChairs, (chairX) => Math.abs(chairX - record.crowdX))
    freeChairs.splice(freeChairs.indexOf(nearest), 1)
    record.spriteName = choose(CHAIR_NPCS).name
    record.chairX = nearest
  })

  return crowd
}

function startRound(level) {
  round.clearedBefore = totalCleared()
  round.level = level
  round.timeLeft = roundTime(level)
  round.doorSoundsPlayed = false
  round.trainArrived = false
  round.closing = false
  round.tutorialStep = level === 1 ? TUTORIAL_STEP.CLEAR_OUTSIDE : TUTORIAL_STEP.NONE
  round.crowds = {
    bg_inside: addChairNpcs(makeCrowd(), level > 1 ? CHAIR_NPCS_PER_ROUND : 0),
    bg_outside: makeCrowd(),
  }
}

function startNewGame() {
  round.crowds = {}
  round.clearedBefore = 0
  round.teleportsUsed = 0
  startRound(save.tutorialDone ? 2 : 1)
}

function allNpcs() {
  return Object.values(round.crowds).flat()
}

function peopleLeft() {
  return allNpcs().filter((record) => !record.cleared).length
}

function totalCleared() {
  return round.clearedBefore + allNpcs().filter((record) => record.cleared).length
}

function recordHighScore() {
  save.highScore = Math.max(save.highScore, totalCleared())
  writeSave()
}

function teleportsLeft() {
  return upgradeLevel(save.equipped, "teleport") - round.teleportsUsed
}
