// ============================================================================
// Game scenes
// ============================================================================

function finishRound() {
  // the tutorial doesn't count towards the score, so everyone starts level 2 on 0
  if (round.level === 1) {
    startNewGame()
    go("game_outside")
    return
  }

  recordHighScore()
  if (peopleLeft() > 0) {
    go("game_over", { background: "bg_inside", level: round.level, cleared: totalCleared() })
  } else {
    startRound(round.level + 1)
    go("game_outside")
  }
}

function playDoorClose() {
  const doorVideo = addDoorVideoOverlay()

  let finished = false
  function finishOnce() {
    if (finished) return
    finished = true
    finishRound()
  }

  doorClosingSounds()

  DOOR_CLS_INSIDE.currentTime = 0
  DOOR_CLS_INSIDE.play().catch(finishOnce)

  doorVideo.onUpdate(() => {
    if (DOOR_CLS_INSIDE.error || (DOOR_CLS_INSIDE.ended && !DOOR_CLS_INSIDE.seeking)) {
      finishOnce()
      return
    }
    if (isVideoFrameReady(DOOR_CLS_INSIDE)) {
      drawDoorCloseFrame(DOOR_CLS_INSIDE)
      doorVideo.opacity = 1
    }
  })
}

scene("intro_video", ()=>{
  const VideoOverlay = add([
    sprite("door_video")
  ])
})

scene("game_inside", ({ playerX } = {}) => {
  addGameWorld({ background: "bg_inside", playerX })

  if (round.closing) playDoorClose()
})

scene("game_outside", () => {
  addGameWorld({
    background: "bg_outside",
    exitTo: "game_inside",
    queueNpcs: true,
    canExit: () => round.trainArrived && allCleared(round.crowds.bg_outside),
  })

  const doorVideo = addDoorVideoOverlay()

  function skipVideo() {
    round.trainArrived = true
    doorVideo.destroy()
  }

  // the train only arrives once per round; coming back mid-round keeps it paused with doors open
  if (!round.trainArrived) {
    DOOR_OPN_OUTSIDE.currentTime = 0
    DOOR_OPN_OUTSIDE.play().catch(skipVideo)
  } else if (DOOR_OPN_OUTSIDE.currentTime < DOOR_OPEN_TIME) {
    doorVideo.destroy()
  }

  doorVideo.onUpdate(() => {
    if (DOOR_OPN_OUTSIDE.error) {
      skipVideo()
      return
    }
    if (!round.trainArrived && DOOR_OPN_OUTSIDE.currentTime >= DOOR_OPEN_TIME) {
      DOOR_OPN_OUTSIDE.pause()
      round.trainArrived = true
    }
    if (isVideoFrameReady(DOOR_OPN_OUTSIDE)) {
      drawTrainFrame(DOOR_OPN_OUTSIDE)
      doorVideo.opacity = 1
    }
  })
})

scene("game_over", ({ background, level, cleared }) => {
  setCursor("default")
  addBackground(background)

  // placeholder: swap this rect for the game over frame image
  add([
    rect(360, 200),
    pos(center()),
    anchor("center"),
    color(...NAVY),
    outline(4, rgb(255, 255, 255)),
  ])

  function addCenteredText(message, size, offsetY) {
    add([
      text(message, { size }),
      pos(center().x, center().y + offsetY),
      anchor("center"),
    ])
  }

  addCenteredText("Game Over", 32, -65)
  addCenteredText(`Total people cleared: ${cleared}`, 18, -22)
  addCenteredText(`Highscore: ${save.highScore}`, 18, 6)
  addCenteredText(`Level: ${level}`, 18, 34)
  addCenteredText("Click to go home", 14, 70)

  onMousePress(() => go("welcome"))
})
