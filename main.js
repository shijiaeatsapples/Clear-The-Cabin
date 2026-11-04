kaboom({
  width: 640,
  height: 360,
  letterbox: true,
  crisp: true,
  background: [0, 0, 0],
})

// ============================================================================
// Constants
// ============================================================================

// World
const BG_WIDTH = 950
const FLOOR_Y = 300
const MIN_X = 60
const MAX_X = BG_WIDTH - 60

// UI
const CURSOR = "url(assets/welcome_scr/cursor_train.png)30 50, auto"
const NAVY = [30, 55, 104]
const HIGHLIGHT_YELLOW = [255, 225, 60]
const HOVER_GROW = 1.1
const PREVIEW_POS = vec2(-337, 335 + 128 * 1.2)
const PREVIEW_SCALE = 1

// Game screen labels: change the wording, size and colour of each one here
const HUD_LABELS = {
  round: { size: 16, color: HIGHLIGHT_YELLOW, format: (level, time) => (level === 1 ? "Tutorial" : `Level ${level}   Time: ${time}`) },
  left: { size: 16, color: HIGHLIGHT_YELLOW, format: (count) => `${count} left to clear.` },
  highScore: { size: 14, color: [255, 255, 255], format: (score) => `Highscore Clearance: ${score}` },
  cleared: { size: 12, color: [255, 255, 255], format: (count) => `Cleared: ${count}` },
  stats: { size: 12, color: [255, 255, 255], format: (speed, luck) => `Speed: ${speed}   Luck: ${luck}%` },
  resistance: { size: 12, color: [255, 255, 255], format: (percent) => `Resistance: ${percent}%` },
  teleport: { size: 12, color: [255, 255, 255], format: (count) => `Teleport (T): ${count}` },
}

// On-screen movement icons
const MOVE_ICON_SCALE = 0.5
const MOVE_ICON_MARGIN = 35
const MOVE_ICON_Y = 270
const MOVE_ICON_IDLE_OPACITY = 0.7

// Doors
const DOORS = [165, 477, 787]
const DOOR_WIDTH = 95
const DOOR_TOP = 95
const DOOR_RANGE = 100
const DOOR_OPEN_TIME = 3.2

// Player
const SPEED = 80
const SPEED_PER_UPGRADE = 8
const PLAYER_Y = FLOOR_Y + 10

// NPC movement
const CLEAR_DIST = 70
const NPC_SPEED = 40
const ROAM_SPEED = 30
const ROAM_IDLE_CHANCE = 0.4
const NPCS_PER_DOOR = 2
const CROWD_SPACING = 25

const QUEUE_ZONES = [
  { from: 240, to: 385 },
  { from: 550, to: 712 },
]

// NPCs walking back to the doors
const RETURN_CHECK_TIME = 5
const RETURN_CHANCE_STEP = 0.05
const MAX_RETURN_CHANCE = 0.35

// Round timer
const ROUND_TIME = 30
const ROUND_TIME_STEP = 2
const MIN_ROUND_TIME = 14
const DOOR_SOUND_TIME = 8

// Arrow pointing at the nearest uncleared NPC
const ARROW_TIME = 10
const ARROW_HEIGHT = 135
const ARROW_DEAD_ZONE = 10

// Dragging
const DRAG_SPEED = 400
const DRAG_SPEED_FALLOFF = 0.8
const MIN_DRAG_SPEED = 60
const MULTI_GRAB_RADIUS = 40
const RESISTANCE_PER_UPGRADE = 0.15

// Luck
const BASE_LUCK = 0.5
const LUCK_PER_UPGRADE = 0.05
const LUCK_DECAY_PER_LEVEL = 0.03
const MIN_LUCK = 0.4

// Chairs
const CHAIR_NPCS_PER_ROUND = 1
const CHAIRS = [251, 388, 561, 697]
const CHAIR_Y = 217
const CHAIR_WIDTH = 36
const CHAIR_HEIGHT = 56
const CHAIR_DROP_RANGE = 25
const SEATED_Y = 252
// swap for the sitting animation once it has been added to CHARACTER_SHEET
const SIT_ANIM = "sit"
const SEATER_HINT = "For all child, elderly, and pregnant women, place them on the chairs highlighted in yellow!"

// Tutorial
const TUTORIAL_STEP = {
  NONE: 0,
  CLEAR_OUTSIDE: 1,
  ENTER_TRAIN: 2,
  CLEAR_INSIDE: 3,
  EARN_COINS: 4,
  WARNING: 5,
}

const TUTORIAL_TEXT = {
  [TUTORIAL_STEP.CLEAR_OUTSIDE]: "You have 30 seconds to drag all the players away from the doors.",
  [TUTORIAL_STEP.ENTER_TRAIN]: "Click the train door to get INSIDE the train.",
  [TUTORIAL_STEP.CLEAR_INSIDE]: "Quick, drag all the players away from the door!",
  [TUTORIAL_STEP.EARN_COINS]: "For each player dragged, you would earn coins, which can be exchanged for skins and upgrades in the shop! (Click to continue)",
  [TUTORIAL_STEP.WARNING]: "Phew... Great Job! But beware...There are some really inconsiderate passengers. Keep going! (Click to continue)",
}

// Shop
const PLAYERS = {
  edward: { price: 0, speed: SPEED, maxDrag: 1, grabRange: 100, sizeFix: 1, ability: "Ability: none", name:"EDWARD"},
  xiaoming: { price: 100, speed: SPEED, maxDrag: 1, grabRange: 160, sizeFix: 1, ability: "Ability: wider range", name:"XIAOMING"},
  jason: { price: 200, speed: SPEED - 5, maxDrag: 2, grabRange: 100, sizeFix: 1, ability: "Ability: drag 2 at once",name: "JASON" },
  tilda:{price: 500, speed: SPEED +100, maxDrag:1, grabRange: 90, sizeFix:1, ability: "Ability: zooming through the crowd",name: "TILDA"}
}
const PLAYER_NAMES = Object.keys(PLAYERS)

const UPGRADES = {
  speed: { label: "Speed", baseCost: 10, costGrowth: 1.6, maxLevel: 5 },
  luck: { label: "Luck", baseCost: 15, costGrowth: 1.6, maxLevel: 5 },
  resistance: { label: "Resist", baseCost: 12, costGrowth: 1.6, maxLevel: 5 },
  teleport: { label: "Teleport", baseCost: 1000, costGrowth: 1, maxLevel: 2 },
}

// ============================================================================
// Assets
// ============================================================================

const CHARACTER_SHEET = {
  sliceX: 4,
  sliceY: 4,
  anims: {
    idle: 0,
    sit: {from: 0, to: 1, speed: 10},
    walk: { from: 8, to: 11, loop: true, speed: 12 },
    frt_walk: { from: 4, to: 7, loop: true, speed: 14 },
  },
}

const NPC_SPRITES = ["npc1", "npc2", "npc3", "npc4", "npc5","npc6"]

const CHAIR_NPCS = [
  { name: "npc20", path: "assets/NPC/NPC20.png" },
  { name: "npc21", path: "assets/NPC/NPC21.png" },
  { name: "npc22", path: "assets/NPC/NPC22.png" },
]

const BACKGROUNDS = [
  { name: "bg_inside", path: "assets/background_inside.png" },
  { name: "bg_outside", path: "assets/background_outside.png" },
]

const WELCOME_SCR = [
  { name: "ourCauseBtn", path: "assets/welcome_scr/our_cause_btn.png" },
  { name: "logo", path: "assets/logo.png" },
  { name: "enter_label", path: "assets/welcome_scr/enter_label.png" },
  { name: "credBtn", path: "assets/welcome_scr/cred_btn.png" },
  { name: "shopBtn", path: "assets/welcome_scr/shop/shop_btn.png" },
  { name: "credFrame", path: "assets/welcome_scr/cred_frame.png" },
  { name: "cancelBtn", path: "assets/welcome_scr/cancel_btn.png" },
  { name: "shopFrame", path: "assets/welcome_scr/shop/shop_frame.png" },
  { name: "shopLeft", path: "assets/welcome_scr/shop/shop_left.png" },
  { name: "shopRight", path: "assets/welcome_scr/shop/shop_right.png" },
  { name: "shopBuy", path: "assets/welcome_scr/shop/shop_price.png" },
]

const GAME_SCR = [
  { name: "playerCurrency", path: "assets/player_currency.png" },
  { name: "home", path: "assets/home_icon.png" },
  { name: "moveLeft", path: "assets/left.png" },
  { name: "moveRight", path: "assets/right.png" },
]

const SOUNDS = [
  {name: "bgm", path: ""},
  {name: "btn", path: "sounds/btn.mp3"},
  {name: "buy", path: "sounds/buy.mp3"},
  {name: "closing", path: "sounds/closing.mp3"},
  {name: "coin", path: "sounds/coin.mp3"},
  {name: "footsteps", path: "sounds/footsteps.mp3"},
  {name: "PA", path: "sounds/PA.mp3"},
]

SOUNDS.forEach((m)=>{
  loadSound(m.name, m.path)
})

function startBgm(){
  play("bgm",{
    loop:true,
    volume:0.25
  })
}

let footsteps = null

function setFootsteps(walking){
  if (walking && !footsteps) {
    footsteps = play("footsteps",{
      loop:true,
      volume:1.5
    })
  } else if (!walking && footsteps) {
    footsteps.stop()
    footsteps = null
  }
}

function btnSound(){
  play("btn",{
    volume:1
  })
}

function buySound(){
  play("buy",{
    volume:1
  })
}

function coinSound(){
  play("coin",{
    volume:1
  })
}

function doorClosingSounds(){
  if (round.doorSoundsPlayed) return
  round.doorSoundsPlayed = true

  const announcement = play("PA",{
    volume:1
  })
  announcement.onEnd(() => {
    play("closing",{
      volume:1
    })
  })
}


function loadSpriteList(list, options) {
  list.forEach(({ name, path }) => loadSprite(name, path, options))
}

NPC_SPRITES.forEach((name, i) => {
  loadSprite(name, `assets/NPC/NPC${i + 1}.png`, CHARACTER_SHEET)
})
PLAYER_NAMES.forEach((name) => {
  loadSprite(name, `assets/player/${name}_player.png`, CHARACTER_SHEET)
})
loadSpriteList(CHAIR_NPCS, CHARACTER_SHEET)
loadSpriteList(BACKGROUNDS)
loadSpriteList(WELCOME_SCR)
loadSpriteList(GAME_SCR)

// colours any see-through pixel next to the sprite's edge; the step is in atlas texels (5 of 2048)
loadShader("seaterOutline", null, `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  vec4 base = def_frag();
  if (base.a > 0.5) return base;

  float step = 5.0 / 2048.0;
  float edge = 0.0;
  edge = max(edge, texture2D(tex, uv + vec2(step, 0.0)).a);
  edge = max(edge, texture2D(tex, uv + vec2(-step, 0.0)).a);
  edge = max(edge, texture2D(tex, uv + vec2(0.0, step)).a);
  edge = max(edge, texture2D(tex, uv + vec2(0.0, -step)).a);
  edge = max(edge, texture2D(tex, uv + vec2(step, step)).a);
  edge = max(edge, texture2D(tex, uv + vec2(-step, step)).a);
  edge = max(edge, texture2D(tex, uv + vec2(step, -step)).a);
  edge = max(edge, texture2D(tex, uv + vec2(-step, -step)).a);

  return edge > 0.5 ? vec4(1.0, 0.88, 0.24, 1.0) : base;
}
`)

function loadArrowSprite(name, { width, height, points, fill, stroke }) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  ctx.beginPath()
  points.forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = stroke
  ctx.stroke()

  loadSprite(name, canvas)
}

// placeholder: swap for loadSprite("arrow", "assets/your_arrow.png"), with the image pointing right
loadArrowSprite("arrow", {
  width: 48,
  height: 32,
  points: [[2, 10], [26, 10], [26, 2], [46, 16], [26, 30], [26, 22], [2, 22]],
  fill: "#e0263c",
  stroke: "#ffffff",
})

// placeholder: swap for loadSprite("chair_arrow", "assets/your_arrow.png"), with the image pointing down
loadArrowSprite("chair_arrow", {
  width: 32,
  height: 40,
  points: [[10, 2], [22, 2], [22, 20], [30, 20], [16, 38], [2, 20], [10, 20]],
  fill: "#ffe13c",
  stroke: "#1e3768",
})

// ============================================================================
// Door videos
// ============================================================================

function createDoorVideo(src) {
  const video = document.createElement("video")
  video.src = src
  video.crossOrigin = "anonymous"
  video.controls = false
  video.muted = true
  video.playsInline = true
  video.preload = "auto"
  return video
}

const DOOR_OPN_OUTSIDE = createDoorVideo("assets/door_open_outside.MOV")
const DOOR_CLS_INSIDE = createDoorVideo("assets/door_close_inside.mp4")
const INTRO_VID = createDoorVideo("")

const VIDEO_CANVAS = document.createElement("canvas")
VIDEO_CANVAS.width = BG_WIDTH
VIDEO_CANVAS.height = height()
const VIDEO_CTX = VIDEO_CANVAS.getContext("2d")
loadSprite("door_video", VIDEO_CANVAS)

// [video x start, video x end, game x start, game x end], same cuts as background_outside.png
const TRAIN_SLICES = [
  [0, 123, 52.5, 105],
  [123, 582, 105, 225],
  [582, 1347, 225, 417],
  [1347, 1805, 417, 537],
  [1805, 2747, 537, 727],
  [2747, 3206, 727, 847],
  [3206, 3500, 847, 950],
]

function drawTrainSlice(video, [sx0, sx1, dx0, dx1]) {
  // y values skip the video's white strips and watermark
  VIDEO_CTX.drawImage(video, sx0, 120, sx1 - sx0, 834, dx0, 40, dx1 - dx0, 278)
}

// sprites share a texture atlas, so frames must be written to this sprite's slot
function uploadVideoFrame() {
  const { tex, frames } = getSprite("door_video").data
  tex.update(VIDEO_CANVAS, frames[0].x * tex.width, frames[0].y * tex.height)
}

function drawDoorCloseFrame(video) {
  VIDEO_CTX.clearRect(0, 0, VIDEO_CANVAS.width, VIDEO_CANVAS.height)
  // y values skip the video's white strips
  VIDEO_CTX.drawImage(video, 0, 117, 2850, 942, 0, 39, BG_WIDTH, 314)
  uploadVideoFrame()
}

function drawTrainFrame(video) {
  VIDEO_CTX.clearRect(0, 0, VIDEO_CANVAS.width, VIDEO_CANVAS.height)
  TRAIN_SLICES.forEach((slice) => drawTrainSlice(video, slice))

  // the far left of the background is a mirrored copy of the wall
  VIDEO_CTX.save()
  VIDEO_CTX.translate(52.5, 0)
  VIDEO_CTX.scale(-1, 1)
  drawTrainSlice(video, [0, 123, 0, 52.5])
  VIDEO_CTX.restore()

  uploadVideoFrame()
}

function isVideoFrameReady(video) {
  return video.readyState >= 2 && !video.seeking
}

function addDoorVideoOverlay() {
  return add([
    sprite("door_video"),
    pos(0, 0),
    z(-0.5),
    opacity(0),
  ])
}

// ============================================================================
// Save data
// ============================================================================

const SAVE_KEY = "sit_mrt_save"
const DEFAULT_SAVE = {
  currency: 0,
  owned: ["edward"],
  equipped: "edward",
  upgrades: {},
  highScore: 0,
  tutorialDone: false,
  seaterHintSeen: false,
}

function loadSave() {
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY))
    if (data) return { ...DEFAULT_SAVE, ...data }
  } catch (e) {}
  return { ...DEFAULT_SAVE }
}

function writeSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch (e) {}
}

const save = loadSave()
if (!PLAYERS[save.equipped]) save.equipped = "edward"

// ============================================================================
// Player stats and difficulty
// ============================================================================

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
  return Math.max(playerLuck(name) - (level - 1) * LUCK_DECAY_PER_LEVEL, MIN_LUCK)
}

// level 1 is the untimed tutorial, so level 2 is the first round with the full time
function roundTime(level) {
  return Math.max(ROUND_TIME - Math.max(level - 2, 0) * ROUND_TIME_STEP, MIN_ROUND_TIME)
}

// resistance is the share of drag speed lost: it grows each level, upgrades shrink it
function currentResistance(name, level) {
  const levelResistance = 1 - Math.max(DRAG_SPEED_FALLOFF ** (level - 1), MIN_DRAG_SPEED / DRAG_SPEED)
  return levelResistance * (1 - upgradeLevel(name, "resistance") * RESISTANCE_PER_UPGRADE)
}

function dragSpeed(name, level) {
  return DRAG_SPEED * (1 - currentResistance(name, level))
}

function returnChance(level) {
  return Math.min((level - 1) * RETURN_CHANCE_STEP, MAX_RETURN_CHANCE)
}

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
    highScoreLabel.text = `Highscore Clearance: ${highScore}`
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

// ============================================================================
// Welcome scene
// ============================================================================

function addMenuButton(name, position) {
  return add([
    sprite(name),
    pos(position),
    scale(0.2),
    anchor("center"),
    area(),
    "btn",
  ])
}

function addMenuFrame(name) {
  return add([
    sprite(name),
    pos(600, 100),
    anchor("topright"),
    scale(0.3),
    z(2),
    opacity(0),
  ])
}

function addCancelButton(frame) {
  return frame.add([
    sprite("cancelBtn"),
    anchor("topright"),
    pos(-55, 45),
    scale(0.1),
    area(),
    z(100),
    opacity(0),
    "btn",
  ])
}

function addShopArrowButton(frame, name, x) {
  return frame.add([
    sprite(name),
    anchor("center"),
    pos(x, 335),
    scale(0.5),
    area(),
    z(10),
    opacity(0),
    "btn",
  ])
}

function addShopMenu(onClose) {
  let shopIndex = 0
  const selectedPlayer = () => PLAYER_NAMES[shopIndex]

  const frame = addMenuFrame("shopFrame")
  const isOpen = () => frame.opacity > 0

  const cancelBtn = addCancelButton(frame)
  const leftBtn = addShopArrowButton(frame, "shopLeft", -580)
  const rightBtn = addShopArrowButton(frame, "shopRight", -94)

  const preview = frame.add([
    sprite(PLAYER_NAMES[0], { anim: "idle" }),
    anchor("bot"),
    pos(PREVIEW_POS),
    scale(PREVIEW_SCALE),
    area(),
    z(10),
    opacity(0),
  ])

  const ability = frame.add([
    text(PLAYERS[PLAYER_NAMES[0]].ability, { size: 20 }),
    pos(-337, 170),
    anchor("center"),
    color(...NAVY),
    z(10),
    opacity(0),
  ])

  const playerName = frame.add([
    text(PLAYERS[PLAYER_NAMES], {size:30}),
    pos(-337, 140),
    anchor("center"),
    color(...NAVY),
    z(11),
    opacity(0)
  ])

  // placeholder: swap each rect for its upgrade button image
  function addUpgradeButton(key, x, y) {
    const button = frame.add([
      rect(270, 95, { radius: 12 }),
      pos(x, y),
      anchor("center"),
      color(...NAVY),
      scale(1),
      area(),
      z(20),
      opacity(0.7),
      "btn",
      { upgradeKey: key },
    ])

    button.label = button.add([
      text("", { size: 33, align: "center" }),
      anchor("center"),
      opacity(0),
      color(255, 0, 0)
    ])

    button.onClick(() => {
      if (button.opacity === 0) return

      const name = selectedPlayer()
      const level = upgradeLevel(name, key)
      const cost = upgradeCost(name, key)

      if (level >= UPGRADES[key].maxLevel || save.currency < cost) {
        shake(4)
        return
      }

      save.currency -= cost
      save.upgrades[name] = { ...save.upgrades[name], [key]: level + 1 }
      writeSave()
    })

    return button
  }

  const upgradeButtons = [
    addUpgradeButton("speed", -477, 445),
    addUpgradeButton("luck", -197, 445),
    addUpgradeButton("resistance", -477, 245),
    addUpgradeButton("teleport", -197, 245),
  ]

  // upgrade buttons only show while hovering an owned character or the buttons themselves
  onUpdate(() => {
    const name = selectedPlayer()
    const canUpgrade = isOpen() && save.owned.includes(name)
    const hovered = preview.isHovering() || upgradeButtons.some((b) => b.isHovering())
    const shown = canUpgrade && hovered ? 1 : 0

    upgradeButtons.forEach((button) => {
      const { label, maxLevel } = UPGRADES[button.upgradeKey]
      const level = upgradeLevel(name, button.upgradeKey)
      button.opacity = shown
      button.label.opacity = shown
      button.label.text = level >= maxLevel
        ? `${label} MAX`
        : `${label} Lv${level}\n$${upgradeCost(name, button.upgradeKey)}`
    })
  })

  const buyBtn = frame.add([
    sprite("shopBuy"),
    pos(-337, 560),
    anchor("center"),
    scale(1),
    area(),
    z(10),
    opacity(0),
    "btn",
  ])

  const price = buyBtn.add([
    text(`$${PLAYERS[PLAYER_NAMES[0]].price}`, { size: 50 }),
    pos(-35, 0),
    anchor("center"),
    color(...NAVY),
    z(100),
    opacity(0),
  ])

  function buyButtonLabel(name) {
    if (save.equipped === name) return "Equipped"
    if (save.owned.includes(name)) return "Equip"
    return `$${PLAYERS[name].price}`
  }

  function showPreview() {
    const name = selectedPlayer()
    preview.use(sprite(name, { anim: "idle" }))
    preview.pos = PREVIEW_POS
    preview.scale = vec2(PREVIEW_SCALE)
    ability.text = PLAYERS[name].ability
    playerName.text = PLAYERS[name].name
    price.text = buyButtonLabel(name)
    price.textSize = save.equipped === name ? 36 : 50
  }

  function browse(step) {
    if (!isOpen()) return
    shopIndex = (shopIndex + step + PLAYER_NAMES.length) % PLAYER_NAMES.length
    showPreview()
  }

  leftBtn.onClick(() => browse(-1))
  rightBtn.onClick(() => browse(1))

  buyBtn.onClick(() => {
    if (!isOpen()) return

    const name = selectedPlayer()
    const cost = PLAYERS[name].price

    if (save.owned.includes(name)) {
      save.equipped = name
    } else if (save.currency >= cost) {
      save.currency -= cost
      save.owned.push(name)
      buySound()
    } else {
      shake(4)
      return
    }

    writeSave()
    showPreview()
  })

  const parts = [frame, cancelBtn, leftBtn, rightBtn, preview, ability, buyBtn, price, playerName]
  const setVisible = (visible) => parts.forEach((part) => { part.opacity = visible ? 1 : 0 })

  cancelBtn.onClick(() => {
    if (!isOpen()) return
    onClose()
    setVisible(false)
  })

  return {
    isOpen,
    open() {
      setVisible(true)
      shopIndex = 0
      showPreview()
    },
  }
}

function addCreditsMenu(onClose) {
  const frame = addMenuFrame("credFrame")
  const cancelBtn = addCancelButton(frame)
  const isOpen = () => frame.opacity > 0

  function setVisible(visible) {
    frame.opacity = visible ? 1 : 0
    cancelBtn.opacity = visible ? 1 : 0
  }

  cancelBtn.onClick(() => {
    if (!isOpen()) return
    onClose()
    setVisible(false)
  })

  return { isOpen, open: () => setVisible(true) }
}

function addButtonHoverEffects() {
  onHover("btn", (b) => {
    if (b.opacity === 0) return
    setCursor("pointer")
    b.baseScale = b.scale.clone()
    b.scale = b.baseScale.scale(HOVER_GROW)
  })

  onHoverEnd("btn", (b) => {
    setCursor(CURSOR)
    if (b.baseScale) b.scale = b.baseScale
  })
}


scene("welcome", () => {
  setCursor(CURSOR)
  addCurrencyHUD()
  addBackground("bg_inside")

  add([
    sprite("edward", { anim: "frt_walk" }),
    anchor("bot"),
    scale(0.6),
    pos(center().x, 300),
  ])

  add([
    sprite("logo"),
    pos(47, 75),
    scale(0.3),
  ])

  addMenuButton("ourCauseBtn", vec2(166, 272))

  add([
    sprite("enter_label"),
    scale(0.3),
    pos(105, 88),
  ])

  // the click that closes a menu must not also start the game
  let menuClosedAt = -1
  const markMenuClosed = () => { menuClosedAt = time() }

  const shop = addShopMenu(markMenuClosed)
  const credits = addCreditsMenu(markMenuClosed)

  addButtonHoverEffects()

  addMenuButton("credBtn", vec2(166, 312)).onClick(credits.open)
  addMenuButton("shopBtn", vec2(166, 232)).onClick(shop.open)

  onClick(() => {
    if (get("btn", { recursive: true }).some((b) => b.opacity !== 0 && b.isHovering())) btnSound()
  })

  onClick(() => {
    if (credits.isOpen() || shop.isOpen()) return
    if (time() === menuClosedAt) return
    if (get("btn", { recursive: true }).some((b) => b.opacity !== 0 && b.isHovering())) return
    startNewGame()
    startBgm()
    go("game_outside")
  })
})

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

// ============================================================================
// Game world: NPC helpers
// ============================================================================

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
  // a fully cleared side stays clear, so the way into the train can't close again
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
  npc.roamWait = rand(1, 3)
  return true
}

// returns whether the NPC was dropped somewhere that counts as cleared
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
    save.currency += 1
    npc.record.paid = true
  }
}

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

// ============================================================================
// Game world: behaviour
//
// `world` holds what these share: { player, stats, crowd, exitTo, canExit,
// queueNpcs, dragged, stunTimer }
// ============================================================================

function canEnterDoor(world, door) {
  const blocked = unclearedNpcs().some((npc) => Math.abs(npc.pos.x - door.pos.x) < CLEAR_DIST)
  const inRange = Math.abs(world.player.pos.x - door.pos.x) <= DOOR_RANGE
  return !round.closing && world.canExit() && !blocked && inRange
}

function clickDoorAt(world, mouse) {
  const door = get("door").find((d) => d.hasPoint(mouse))
  if (!door) return

  if (canEnterDoor(world, door)) {
    go(world.exitTo, { playerX: door.pos.x })
  } else {
    shake(2)
  }
}

function grabNpc(world, hit, mouse) {
  const { player, stats } = world

  if (Math.abs(hit.pos.x - player.pos.x) > stats.grabRange) {
    shake(4)
    world.stunTimer = 0.1
    return
  }

  const extras = unclearedNpcs()
    .filter((npc) => npc !== hit && Math.abs(npc.pos.x - hit.pos.x) < MULTI_GRAB_RADIUS)
    .sort((a, b) => Math.abs(a.pos.x - hit.pos.x) - Math.abs(b.pos.x - hit.pos.x))
    .slice(0, stats.maxDrag - 1)

  world.dragged = [hit, ...extras]
  world.dragged.forEach((npc) => {
    npc.dragOffsetX = npc.pos.x - mouse.x
    npc.play("idle")
  })
}

function setupDragging(world) {
  onMousePress(() => {
    // a press on a movement icon must not also grab an NPC or click a door behind it
    if (round.closing || isOverMoveIcon()) return

    const mouse = toWorld(mousePos())
    const hit = unclearedNpcs()
      .filter((npc) => npc.hasPoint(mouse))
      .sort((a, b) => b.z - a.z)[0]

    if (hit) {
      grabNpc(world, hit, mouse)
    } else {
      clickDoorAt(world, mouse)
    }
  })

  onMouseRelease(() => {
    if (world.dragged.length === 0) return

    world.dragged.forEach((npc) => {
      if (placeDroppedNpc(npc, world.queueNpcs)) clearNpc(npc)
    })
    writeSave()
    world.dragged = []
  })
}

function setupCursor(world) {
  onUpdate(() => {
    const mouse = toWorld(mousePos())

    if (world.dragged.length > 0) {
      setCursor("grabbing")
    } else if (isOverMoveIcon()) {
      setCursor("pointer")
    } else if (unclearedNpcs().some((npc) => npc.hasPoint(mouse))) {
      setCursor("grab")
    } else if (get("door").some((d) => d.hasPoint(mouse) && canEnterDoor(world, d))) {
      setCursor("pointer")
    } else {
      setCursor("default")
    }
  })
}

function updateDraggedNpc(npc) {
  const targetX = clamp(toWorld(mousePos()).x + npc.dragOffsetX, MIN_X, MAX_X)
  const maxStep = dragSpeed(save.equipped, round.level) * dt()
  npc.pos.x += clamp(targetX - npc.pos.x, -maxStep, maxStep)
}

function updateClearedNpc(world, npc) {
  if (npc.record.seated || rollReturnToDoor(npc, world.crowd) || world.queueNpcs) return

  if (npc.roamWait > 0) {
    npc.roamWait -= dt()
    playAnim(npc, "idle")
  } else if (walkToward(npc, npc.roamX, ROAM_SPEED)) {
    npc.roamX = pickRoamX(npc.pos.x)
    npc.roamWait = rand(2, 5)
  }
  npc.record.x = npc.pos.x
}

function setupNpcMovement(world) {
  onUpdate("npc", (npc) => {
    if (world.dragged.includes(npc)) {
      updateDraggedNpc(npc)
    } else if (npc.record.cleared) {
      updateClearedNpc(world, npc)
    } else {
      walkToward(npc, npc.crowdX, NPC_SPEED)
    }
  })
}

function setupRoundTimer(world) {
  onUpdate(() => {
    if (round.level === 1 || !round.trainArrived || round.closing) return

    round.timeLeft -= dt()
    if (round.timeLeft <= DOOR_SOUND_TIME) doorClosingSounds()
    if (round.timeLeft > 0 && peopleLeft() > 0) return

    round.closing = true
    go("game_inside", { playerX: world.player.pos.x })
  })
}

function setupTeleport(world) {
  const { player, stats } = world

  onKeyPress("t", () => {
    if (round.closing || teleportsLeft() <= 0) return

    // only people out of grab range are worth a teleport, so one can't be wasted
    const targets = unclearedNpcs().filter((npc) => !world.dragged.includes(npc) &&
      Math.abs(npc.pos.x - player.pos.x) > stats.grabRange)
    if (targets.length === 0) {
      shake(2)
      return
    }

    player.pos.x = clamp(nearestNpc(targets, player.pos.x).pos.x, MIN_X, MAX_X)
    round.teleportsUsed += 1
  })
}

function setupCrowdArrow(world) {
  const { player } = world

  const crowdArrow = add([
    sprite("arrow"),
    pos(player.pos),
    anchor("center"),
    z(900),
    opacity(0),
  ])

  onUpdate(() => {
    const targets = unclearedNpcs().filter((npc) => !world.dragged.includes(npc))
    const active = round.trainArrived && !round.closing && round.timeLeft <= ARROW_TIME && targets.length > 0
    crowdArrow.opacity = active ? 1 : 0
    if (!active) return

    const dx = nearestNpc(targets, player.pos.x).pos.x - player.pos.x
    if (Math.abs(dx) > ARROW_DEAD_ZONE) crowdArrow.flipX = dx < 0
    crowdArrow.pos = vec2(player.pos.x, player.pos.y - ARROW_HEIGHT)
  })
}


//PLAYER MOVEMENT
function setupPlayerMovement(world) {
  const { player } = world

  const leftIcon = addMoveIcon("moveLeft", MOVE_ICON_MARGIN)
  const rightIcon = addMoveIcon("moveRight", width() - MOVE_ICON_MARGIN)

  // sliding onto an icon while dragging an NPC doesn't count as pressing it
  const isIconHeld = (icon) => isMouseDown() && icon.isHovering() && world.dragged.length === 0

  onUpdate(() => {
    const leftPressed = isKeyDown("left") || isKeyDown("a") || isIconHeld(leftIcon)
    const rightPressed = isKeyDown("right") || isKeyDown("d") || isIconHeld(rightIcon)
    let dir = 0

    if (world.stunTimer > 0) {
      world.stunTimer -= dt()
    } else if (!round.closing) {
      if (leftPressed) dir -= 1
      if (rightPressed) dir += 1
    }

    setFootsteps(dir !== 0)

    leftIcon.opacity = leftPressed ? 1 : MOVE_ICON_IDLE_OPACITY
    rightIcon.opacity = rightPressed ? 1 : MOVE_ICON_IDLE_OPACITY

    player.pos.x = clamp(player.pos.x + dir * playerSpeed(save.equipped) * dt(), MIN_X, MAX_X)

    if (dir !== 0) player.flipX = dir < 0
    playAnim(player, dir !== 0 ? "walk" : "idle")

    followWithCamera(player)
  })

  onSceneLeave(() => setFootsteps(false))
}

function addGameWorld({ background, exitTo, playerX = width() / 2, canExit = () => true, queueNpcs = false }) {
  addBackground(background)

  const stats = PLAYERS[save.equipped]
  const crowd = round.crowds[background]
  const player = addPlayer(playerX, stats)
  const world = { player, stats, crowd, exitTo, canExit, queueNpcs, dragged: [], stunTimer: 0 }

  addCurrencyHUD()
  addRoundHUD()
  addPlayerStatsHUD()

  add([
    sprite("logo"),
    pos(width() / 2, 40),
    anchor("center"),
    scale(0.1),
    fixed(),
  ])

  if (exitTo) addDoors()
  addNpcs(crowd)
  crowd.filter((record) => isSeater(record) && !record.seated).forEach(addChairHighlight)

  if (!save.seaterHintSeen && !round.closing && crowd.some(isSeater)) addSeaterHint()

  setupDragging(world)
  setupCursor(world)
  setupNpcMovement(world)
  setupRoundTimer(world)
  setupTeleport(world)
  setupCrowdArrow(world)
  setupPlayerMovement(world)

  // last, so the tutorial's skip button can override the cursor set above
  if (round.level === 1 && !round.closing) addTutorial(background, player)
}

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

onLoad(() => go("welcome"))
