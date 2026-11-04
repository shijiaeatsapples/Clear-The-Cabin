// ============================================================================
// Shared UI
// ============================================================================

function addBackground(name) {
  return add([
    sprite(name),
    pos(0, 0),
    z(-1),
  ])
}

function formatCurrency(amount) {
  if (amount > 1000) {
    return `$${parseFloat((amount / 1000).toFixed(1))}k`
  }
  return `$${amount}`
}

function addCurrencyHUD() {
  const hud = add([
    sprite("playerCurrency"),
    anchor("topright"),
    pos(width(), 50),
    area(),
    scale(0.3),
    fixed(),
  ])

  const label = hud.add([
    text(formatCurrency(save.currency), { size: 50 }),
    pos(-hud.width / 2 - 35, hud.height / 2),
    anchor("center"),
    area(),
    fixed(),
    z(100),
    color(...NAVY),
  ])

  label.onUpdate(() => {
    label.text = formatCurrency(save.currency)
  })

  return hud
}

function addHudText(size, position, anchorName) {
  return add([
    text("", { size }),
    pos(position),
    anchor(anchorName),
    fixed(),
    z(1000),
  ])
}

function addRoundHUD() {
  const roundLabel = addHudText(16, vec2(12, 12), "topleft")
  const leftLabel = addHudText(16, vec2(width() / 2, height() - 16), "center")
  const highScoreLabel = addHudText(14, vec2(width() - 12, 12), "topright")
  const clearedLabel = addHudText(12, vec2(12, height() - 12), "botleft")

  onUpdate(() => {
    const isTutorial = round.level === 1
    const highScore = isTutorial ? save.highScore : Math.max(save.highScore, totalCleared())

    roundLabel.text = isTutorial ? "Tutorial" : `Level ${round.level}   Time: ${Math.ceil(round.timeLeft)}`
    leftLabel.text = `${peopleLeft()} left to clear.`
    highScoreLabel.text = `Highscore: ${highScore}`
    clearedLabel.text = `Cleared: ${totalCleared()}`
  })
}

function addPlayerStatsHUD() {
  const luckPercent = Math.round(currentLuck(save.equipped, round.level) * 100)
  const statsLine = addHudText(12, vec2(width() - 12, height() - 12), "botright")
  statsLine.text = `Speed: ${playerSpeed(save.equipped)}   Luck: ${luckPercent}%`

  const hasTeleport = upgradeLevel(save.equipped, "teleport") > 0
  const resistanceText = `Resistance: ${Math.round(currentResistance(save.equipped, round.level) * 100)}%`

  const secondLine = addHudText(12, vec2(width() - 12, height() - 28), "botright")
  secondLine.onUpdate(() => {
    secondLine.text = hasTeleport ? `Teleport (T): ${teleportsLeft()}   ${resistanceText}` : resistanceText
  })
}

function addMessageBox(message, textWidth) {
  const box = add([
    rect(624, 42, { radius: 6 }),
    pos(8, 316),
    color(...NAVY),
    outline(2, rgb(255, 255, 255)),
    fixed(),
    z(1100),
  ])

  const label = add([
    text(message, { size: 12, width: textWidth }),
    pos(18, 337),
    anchor("left"),
    fixed(),
    z(1101),
  ])

  return { box, label }
}
