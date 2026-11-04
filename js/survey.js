

function surveyReward() {
  return save.firstSurveyRewardClaimed ? SURVEY_REPEAT_REWARD : SURVEY_FIRST_REWARD
}

function claimSurveyReward() {
  const reward = surveyReward()
  save.currency += reward
  save.firstSurveyRewardClaimed = true
  writeSave()
  return reward
}

function isOnSurveyButton(gamePos) {
  const { x, y, width: buttonWidth, height: buttonHeight } = SURVEY_BUTTON
  return Math.abs(gamePos.x - x) <= buttonWidth / 2 && Math.abs(gamePos.y - y) <= buttonHeight / 2
}

function addSurveyButton() {
  const { x, y, width: buttonWidth, height: buttonHeight } = SURVEY_BUTTON

  const button = add([
    rect(buttonWidth, buttonHeight, { radius: 8 }),
    pos(x, y),
    anchor("center"),
    color(255, 209, 220),
    outline(3, rgb(...NAVY)),
    z(10),
  ])
  const label = button.add([
    text(`Complete a short survey for ${formatCurrency(surveyReward())}!`, { size: 16 }),
    anchor("center"),
    color(...NAVY),
    z(1),
  ])

  let state = "ready"
  let openedAt = 0

  function showClaimPrompt() {
    if (state === "opened") label.text = `Finished? Tap to claim ${formatCurrency(surveyReward())}`
  }

  function onTap() {
    if (state === "ready") {
      window.open(SURVEY_URL, "_blank", "noopener")
      state = "opened"
      openedAt = Date.now()
      btnSound()
      showClaimPrompt()
    } else if (state === "opened") {
      
      if (Date.now() - openedAt < SURVEY_MIN_SECONDS * 1000) {
        shake(2)
        label.text = "Please finish the survey first! >:("
        wait(2, showClaimPrompt)
        return
      }
      state = "claimed"
      buySound()
      label.text = `Thanks! ${formatCurrency(claimSurveyReward())} added.`
      button.color = rgb(...PANEL_CREAM)
    }
  }

  const stopListening = listenForRealTap(isOnSurveyButton, onTap)
  onSceneLeave(stopListening)

  button.onUpdate(() => {
    setCursor(state !== "claimed" && isOnSurveyButton(mousePos()) ? "pointer" : "default")
  })
}
