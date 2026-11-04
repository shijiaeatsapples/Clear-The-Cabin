
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


const UPGRADE_PANEL = { x: 276, y: 106, width: 120, height: 188, rowHeight: 44, rowGap: 4 }
const PANEL_CREAM = [251, 248, 234]
const PANEL_ROW = [240, 235, 212]
const PANEL_SHADOW = [150, 130, 175]
const PANEL_TOO_EXPENSIVE = [150, 150, 160]

const HUD_LABELS = {
  round: { size: 16, color: HIGHLIGHT_YELLOW, format: (level, time) => (level === 1 ? "Tutorial" : `Level ${level}   Time: ${time}`) },
  left: { size: 16, color: HIGHLIGHT_YELLOW, format: (count) => `${count} left to clear.` },
  highScore: { size: 14, color: [255, 255, 255], format: (score) => `Highscore: ${score}` },
  cleared: { size: 12, color: [255, 255, 255], format: (count) => `Cleared: ${count}` },
  stats: { size: 12, color: [255, 255, 255], format: (speed, luck) => `Speed: ${speed}   Luck: ${luck}%` },
  resistance: { size: 12, color: [255, 255, 255], format: (percent) => `Resistance: ${percent}%` },

}

// On-screen movement icons
const MOVE_ICON_SCALE = 0.6
const MOVE_ICON_LEFT_X = 45
const MOVE_ICON_RIGHT_X = 107
const MOVE_ICON_Y = 270
const MOVE_ICON_IDLE_OPACITY = 0.7
// the area a finger can land on to count as pressing an arrow
const MOVE_ZONE_PADDING_X = 30
const MOVE_ZONE_HALF_HEIGHT = 45

// Intro video: seconds without progress before the player is allowed to continue anyway
const INTRO_STALL_TIMEOUT = 15

// Doors
const DOORS = [165, 477, 787]
const DOOR_WIDTH = 95
const DOOR_TOP = 95
const DOOR_RANGE = 100
const DOOR_OPEN_TIME = 3.2
const DOOR_VIDEO_TIMEOUT = 10

// Player
const SPEED = 80
const SPEED_PER_UPGRADE = 5
const PLAYER_Y = FLOOR_Y + 10

// NPC movement
const CLEAR_DIST = 60
const NPC_SPEED = 40
const ROAM_SPEED = 30
const ROAM_IDLE_CHANCE = 0.4
const NPCS_PER_DOOR = 2
const CROWD_SPACING = 25
const NPC_SCALE = 0.45
const NPC20_SCALE = 0.3

const QUEUE_ZONES = [
  { from: 230, to: 395 },
  { from: 540, to: 722 },
]

// NPCs walking back to the doors
const RETURN_CHECK_TIME = 5
const RETURN_CHANCE_STEP = 0.05
const MAX_RETURN_CHANCE = 0.35

// Round timer
const ROUND_TIME = 35
const FULL_TIME_ROUNDS = 3
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
const RESISTANCE_PER_UPGRADE = 0.1

// Luck
const BASE_LUCK = 0.5
const LUCK_PER_UPGRADE = 0.1
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
const SIT_ANIM = "sit"
const SEATER_HINT = "Place all highlighted NPCs on the chairs highlighted!"

const COIN_CURVE = 0.003


const MESSAGE_BOX_Y = 311
const MESSAGE_BOX_HEIGHT = 47
const MESSAGE_MAX_TEXT_SIZE = 20


const TUTORIAL_TEXT_WIDTH = 540
const TUTORIAL_STEP = {
  NONE: 0,
  CLEAR_OUTSIDE: 1,
  ENTER_TRAIN: 2,
  CLEAR_INSIDE: 3,
  EARN_COINS: 4,
  WARNING: 5,
}

const TUTORIAL_TEXT = {
  [TUTORIAL_STEP.CLEAR_OUTSIDE]: "Get closer to the commuters crowding at the train doors by holding the right and left buttons/keys and DRAG them away!",
  [TUTORIAL_STEP.ENTER_TRAIN]: "Great! Now, click the train door to get INSIDE the train.",
  [TUTORIAL_STEP.CLEAR_INSIDE]: "Quick, drag all the players away from the door! Note that there is a time limit...",
  [TUTORIAL_STEP.EARN_COINS]: "For each player dragged, you would earn coins, which can be exchanged for skins and upgrades in the shop! [CLICK TO CONTINUE]",
  [TUTORIAL_STEP.WARNING]: "Phew... Great Job! But beware...There are some really inconsiderate passengers... [CLICK TO CONTINUE]",
}

const PLAYERS = {
  edward: { price: 0, speed: SPEED, maxDrag: 1, grabRange: 100, sizeFix: 1, ability: "Ability: none", name:"EDWARD"},
  xiaoming: { price: 500, speed: SPEED, maxDrag: 1, grabRange: 160, sizeFix: 1, ability: "Ability: wider range", name:"XIAOMING"},
  jason: { price: 1500, speed: SPEED - 5, maxDrag: 2, grabRange: 100, sizeFix: 1, ability: "Ability: drag 2 at once",name: "JASON" },
  tilda:{price: 17500, speed: SPEED +100, maxDrag:1, grabRange: 90, sizeFix:1, ability: "Ability: zooming through the crowd",name: "TILDA"}
}

const PLAYER_NAMES = Object.keys(PLAYERS)

const UPGRADES = {
  speed: { label: "Speed", description: "Walk faster", baseCost: 30, costGrowth: 3},
  luck: { label: "Luck", description: "Less commuters \n come back", baseCost: 50, costGrowth: 3},
  resistance: { label: "Resistance", description: "Drag faster", baseCost: 80, costGrowth: 3},
}
