
function finishRound() {
  
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

scene("game_over", ({ background, cleared }) => {
  setCursor("default")
  addBackground(background)

  add([
    sprite("gameOver"),
    pos(center().x,center().y+20),
    anchor("center"),
    scale(0.8),
  ])

  function addFrameText(message, y) {
    add([
      text(message, { size: 18 }),
      pos(center().x, y),
      anchor("center"),
      color(...NAVY),
    ])
  }

  addFrameText(`Highscore: ${save.highScore}`, 185)
  addFrameText(`Coins earned: ${formatCurrency(round.coinsEarned)}`, 220)
  addFrameText(`Cleared: ${cleared}`, 255)

  onMousePress(() => go("welcome"))
})
