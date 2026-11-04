function coinsForClear(clearedCount) {
  return Math.round(1 + COIN_CURVE * clearedCount ** 2)
}

function upgradeLevel(name, key) {
  return save.upgrades[name]?.[key] ?? 0
}

function upgradeCost(name, key) {
  return Math.round(UPGRADES[key].baseCost * UPGRADES[key].costGrowth ** upgradeLevel(name, key))
}

function playerSpeed(name) {
  return PLAYERS[name].speed + upgradeLevel(name, "speed") * SPEED_PER_UPGRADE
}

function playerLuck(name) {
  return BASE_LUCK + upgradeLevel(name, "luck") * LUCK_PER_UPGRADE
}

function currentLuck(name, level) {
  return clamp(playerLuck(name) - (level - 1) * LUCK_DECAY_PER_LEVEL, MIN_LUCK, 1)
}

// level 1 is the untimed tutorial, so timed rounds start at level 2
function roundTime(level) {
  const roundsPastFullTime = Math.max(level - 1 - FULL_TIME_ROUNDS, 0)
  return Math.max(ROUND_TIME - roundsPastFullTime * ROUND_TIME_STEP, MIN_ROUND_TIME)
}

// resistance is the share of drag speed lost: it grows each level, upgrades shrink it
function currentResistance(name, level) {
  const levelResistance = 1 - Math.max(DRAG_SPEED_FALLOFF ** (level - 1), MIN_DRAG_SPEED / DRAG_SPEED)
  return levelResistance * Math.max(1 - upgradeLevel(name, "resistance") * RESISTANCE_PER_UPGRADE, 0)
}

function dragSpeed(name, level) {
  return DRAG_SPEED * (1 - currentResistance(name, level))
}

function returnChance(level) {
  return Math.min((level - 1) * RETURN_CHANCE_STEP, MAX_RETURN_CHANCE)
}
