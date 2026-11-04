// ============================================================================
// Tutorial
// ============================================================================

function finishTutorial() {
  save.tutorialDone = true
  writeSave()
}

function addTutorial(background, player) {
  if (background === "bg_inside" && round.tutorialStep === TUTORIAL_STEP.ENTER_TRAIN) {
    round.tutorialStep = TUTORIAL_STEP.CLEAR_INSIDE
  }

  const { label: tutorialText } = addMessageBox("", 540)

  const skipButton = add([
    rect(60, 26, { radius: 4 }),
    pos(596, 337),
    anchor("center"),
    color(224, 38, 60),
    area(),
    fixed(),
    z(1101),
  ])

  skipButton.add([
    text("Skip", { size: 13 }),
    anchor("center"),
  ])

  get("npc").forEach((npc) => {
    npc.glow = npc.add([
      circle(65),
      scale(1, 0.28),
      color(...HIGHLIGHT_YELLOW),
      opacity(0),
    ])
  })

  onMousePress(() => {
    if (skipButton.isHovering()) {
      btnSound()
      finishTutorial()
      startNewGame()
      go("game_outside")
    } else if (isOverMoveIcon()) {
      return
    } else if (round.tutorialStep === TUTORIAL_STEP.EARN_COINS) {
      round.tutorialStep = TUTORIAL_STEP.WARNING
    } else if (round.tutorialStep === TUTORIAL_STEP.WARNING) {
      finishTutorial()
      round.closing = true
      go("game_inside", { playerX: player.pos.x })
    }
  })

  onUpdate(() => {
    if (round.tutorialStep === TUTORIAL_STEP.CLEAR_OUTSIDE && allCleared(round.crowds.bg_outside)) {
      round.tutorialStep = TUTORIAL_STEP.ENTER_TRAIN
    }
    if (round.tutorialStep === TUTORIAL_STEP.CLEAR_INSIDE && allCleared(round.crowds.bg_inside)) {
      round.tutorialStep = TUTORIAL_STEP.EARN_COINS
    }

    tutorialText.text = TUTORIAL_TEXT[round.tutorialStep]
    if (skipButton.isHovering()) setCursor("pointer")

    const clearingStep = round.tutorialStep === TUTORIAL_STEP.CLEAR_OUTSIDE || round.tutorialStep === TUTORIAL_STEP.CLEAR_INSIDE
    get("npc").forEach((npc) => {
      const highlighted = clearingStep && !npc.record.cleared
      npc.color = rgb(255, 255, highlighted ? wave(60, 255, time() * 6) : 255)
      npc.glow.opacity = highlighted ? wave(0.45, 0.9, time() * 6) : 0
    })
  })
}
