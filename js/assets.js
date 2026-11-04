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
