
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
  // a video stalled on a slow connection must not leave the round stuck forever
  wait(DOOR_VIDEO_TIMEOUT, finishOnce)

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

// shown once to new players: it can't be skipped, and a click only continues once it has ended
scene("intro_video", () => {
  setCursor("default")
  const videoOverlay = addDoorVideoOverlay()

  const continueBox = add([
    rect(560, 70, { radius: 8 }),
    pos(center()),
    anchor("center"),
    color(...NAVY),
    outline(3, rgb(255, 255, 255)),
    z(1),
    opacity(0),
  ])
  const continueLabel = add([
    text("Click anywhere to continue", { size: 32 }),
    pos(center()),
    anchor("center"),
    z(2),
    opacity(0),
  ])

  let finished = false
  let playRequested = false
  let lastTime = -1
  let stalledFor = 0

  function finish() {
    if (finished) return
    finished = true
    INTRO_VID.pause()
    continueBox.opacity = 1
    continueLabel.opacity = 1
  }

  // browsers can refuse sound until a tap, so fall back to silent rather than getting stuck
  function playVideo() {
    playRequested = true
    INTRO_VID.muted = false
    INTRO_VID.play()
      .catch(() => {
        INTRO_VID.muted = true
        return INTRO_VID.play()
      })
      .catch(finish)
      .finally(() => { playRequested = false })
  }

  // runs on a real tap, which is when browsers allow the sound to come on
  function enableSound() {
    if (!finished && INTRO_VID.muted) playVideo()
  }

  document.addEventListener("touchend", enableSound)
  document.addEventListener("click", enableSound)

  INTRO_VID.currentTime = 0
  playVideo()

  videoOverlay.onUpdate(() => {
    if (finished) return
    // networkState 3 means none of the video files could be played
    if (INTRO_VID.ended || INTRO_VID.error || INTRO_VID.networkState === 3) {
      finish()
      return
    }

    // the browser pauses it when switching apps, so pick it up again on return
    if (INTRO_VID.paused && !playRequested) playVideo()

    // a video stuck on a slow connection must not trap a new player here
    stalledFor = INTRO_VID.currentTime === lastTime ? stalledFor + dt() : 0
    lastTime = INTRO_VID.currentTime
    if (stalledFor > INTRO_STALL_TIMEOUT) {
      finish()
      return
    }

    if (isVideoFrameReady(INTRO_VID)) {
      drawIntroFrame(INTRO_VID)
      videoOverlay.opacity = 1
    }
  })

  onMousePress(() => {
    if (!finished) return
    startBgm()
    go("game_outside")
  })

  onSceneLeave(() => {
    document.removeEventListener("touchend", enableSound)
    document.removeEventListener("click", enableSound)
    INTRO_VID.pause()
  })
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
    // a video stalled on a slow connection must not stop the round from starting
    wait(DOOR_VIDEO_TIMEOUT, () => { if (!round.trainArrived) skipVideo() })
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

  addSurveyButton()

  onMousePress(() => {
    if (!isOnSurveyButton(mousePos())) go("welcome")
  })
})
