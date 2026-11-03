kaboom({
  width: 640,
  height: 360,
  letterbox: true,
  crisp: true,
  background: [0, 0, 0],
})

const CURSOR = "url(assets/cursor_train.png)30 50, auto"
const BG_WIDTH = 950

const FLOOR_Y = 300
const MIN_X = 60
const MAX_X = BG_WIDTH - 60

const SPEED = 80

const DOORS = [165, 477, 787]
const DOOR_WIDTH = 95
const DOOR_TOP = 95
const DOOR_RANGE = 100

const CLEAR_DIST = 70
const NPC_SPEED = 40

const ROAM_SPEED = 30
const ROAM_IDLE_CHANCE = 0.4

const CHARACTER_SHEET = {
  sliceX: 4,
  sliceY: 4,
  anims: {
    idle: 0,
    walk: { from: 8, to: 11, loop: true, speed: 12 },
    frt_walk: {from: 4, to:7, loop:true, speed:14},
  },
}

const NPC_SPRITES = ["npc1", "npc2", "npc3","npc4", "npc5"]
NPC_SPRITES.forEach((name, i) => {
  loadSprite(name, `assets/NPC/NPC${i + 1}.png`, CHARACTER_SHEET)
})

const WELCOME_SCR = [
  {name: "ourCauseBtn", path: "assets/welcome_scr/our_cause_btn.png"},
  {name: "logo", path: "assets/logo.png"},
  {name: "enter_label", path: "assets/welcome_scr/enter_label.png"},
  {name: "credBtn", path: "assets/welcome_scr/cred_btn.png"},
  {name: "shopBtn", path: "assets/welcome_scr/shop/shop_btn.png"},
  {name:"credFrame", path:"assets/welcome_scr/cred_frame.png"},
  {name:"cancelBtn", path:"assets/welcome_scr/cancel_btn.png"},
  {name:"shopFrame", path:"assets/welcome_scr/shop/shop_frame.png"},
  {name:"shopLeft", path:"assets/welcome_scr/shop/shop_left.png"},
  {name:"shopRight", path:"assets/welcome_scr/shop/shop_right.png"},
  {name:"shopBuy", path:"assets/welcome_scr/shop/shop_price.png"},
]

const GAME_SCR = [
  {name:"playerCurrency" ,path:"assets/player_currency.png"},
  {name:"logo" ,path:"assets/logo.png"},
  {name:"home" ,path:"assets/home_icon.png"},
]

const PLAYERS = {
  edward: {price: 0, speed: SPEED, maxDrag:1, sizeFix:1},
  xiaoming: {price: 100, speed: SPEED +10 , maxDrag:1, sizeFix:1},
  jason: {price: 200, speed: SPEED -5, maxDrag:2, sizeFix:1},
}

const BACKGROUNDS = [
  {name: "bg_inside", path:"assets/background_inside.png"},
  {name: "bg_outside", path:"assets/background_outside.png"},
]

const DOOR_OPN_INSIDE = document.createElement("video");
DOOR_OPN_INSIDE.src = "assets/door_open_inside.mov";
DOOR_OPN_INSIDE.crossOrigin = "anonymous";
DOOR_OPN_INSIDE.controls = false;
DOOR_OPN_INSIDE.muted = true;
DOOR_OPN_INSIDE.playsInline = true;
DOOR_OPN_INSIDE.preload = "auto";

const VIDEO_CANVAS = document.createElement("canvas");
VIDEO_CANVAS.width = BG_WIDTH;
VIDEO_CANVAS.height = height();
const VIDEO_CTX = VIDEO_CANVAS.getContext("2d");
loadSprite("door_video", VIDEO_CANVAS);

// sprites share a texture atlas, so frames must be written to this sprite's slot
function drawVideoFrame(video) {
  VIDEO_CTX.drawImage(video, 0, 0, VIDEO_CANVAS.width, VIDEO_CANVAS.height);
  const { tex, frames } = getSprite("door_video").data;
  tex.update(VIDEO_CANVAS, frames[0].x * tex.width, frames[0].y * tex.height);
}

BACKGROUNDS.forEach((m)=>{
  loadSprite(m.name, m.path);
})

const PLAYER_SPRITES = Object.keys(PLAYERS)


const PREVIEW_POS = vec2(-337, 335 + 128 * 1.2)
const PREVIEW_SCALE = 1.2

PLAYER_SPRITES.forEach((name)=>{
  loadSprite(name, `assets/player/${name}_player.png`, CHARACTER_SHEET)
})

WELCOME_SCR.forEach((m) =>{
  loadSprite(m.name, m.path);
})

GAME_SCR.forEach((m)=>{
  loadSprite(m.name, m.path);
})




const SAVE_KEY = "sit_mrt_save"
const DEFAULT_SAVE = { currency: 0, owned: ["edward"], equipped: "edward" }

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
    color(30, 55, 104),
  ])

  label.onUpdate(() => {
    label.text = formatCurrency(save.currency)
  })

  return hud
}

scene("welcome",()=>{
  setCursor(CURSOR);
  addCurrencyHUD()
  add([
    sprite("bg_inside"),
    pos(0,0),
    z(-1),
  ]);

  add([
    sprite("edward", { anim: "frt_walk"}),
    anchor("bot"),
    scale(0.6),
    pos(center().x, 300)
  ])

  add([
    sprite("logo"),
    pos(47,75),
    scale(0.3),
  ]);

  function menuButton(name, p) {
    return add([
      sprite(name),
      pos(p),
      scale(0.2),
      anchor("center"),
      area(),
      "btn",
    ])
  }


  menuButton("ourCauseBtn", vec2(166, 272))

  add([
    sprite("enter_label"),
    scale(0.3),
    pos(105,88),
  ])

  const shopFrame = add([
    sprite("shopFrame"),
    pos(600,100),
    anchor("topright"),
    scale(0.3),
    z(2),
    opacity(0),
  ])

  const SFCancelBtn = shopFrame.add([
    sprite("cancelBtn"),
    anchor("topright"),
    pos(-55,45),
    scale(0.1),
    area(),
    z(100),
    opacity(0),
    "btn",

  ])


  const shop_left = shopFrame.add([
    sprite("shopLeft"),
    anchor("center"),
    pos(-580, 335),
    scale(0.5),
    area(),
    z(10),
    opacity(0),
    "btn",
  ])

  const shop_right = shopFrame.add([
    sprite("shopRight"),
    anchor("center"),
    pos(-94, 335),
    scale(0.5),
    area(),
    z(10),
    opacity(0),
    "btn",
  ])

  const shopPreview = shopFrame.add([
    sprite(PLAYER_SPRITES[0],{anim:"idle"}),
    anchor("bot"),
    pos(PREVIEW_POS),
    scale(PREVIEW_SCALE),
    z(10),
    opacity(0)
  ])

  const shopBuy = shopFrame.add([
    sprite("shopBuy"),
    pos(-337, 560),
    anchor("center"),
    scale(1),
    area(),
    z(10),
    opacity(0),
    "btn",
  ])

  const shopPrice = shopBuy.add([
    text(`$${PLAYERS[PLAYER_SPRITES[0]].price}`, { size: 50 }),
    pos(-35, 0),
    anchor("center"),
    color(30, 55, 104),
    z(100),
    opacity(0),
  ])

  let shopIndex = 0

  shop_left.onClick(()=>{
    if (shopFrame.opacity === 0) return;
    shopIndex = (shopIndex - 1 + PLAYER_SPRITES.length) % PLAYER_SPRITES.length
    showShopPreview()
  })

  shop_right.onClick(()=>{
    if (shopFrame.opacity === 0) return;
    shopIndex = (shopIndex + 1) % PLAYER_SPRITES.length
    showShopPreview()
  })

  function shopButtonLabel(name) {
    if (save.equipped === name) return "Equipped"
    if (save.owned.includes(name)) return "Equip"
    return `$${PLAYERS[name].price}`
}

  function showShopPreview(){
    const name = PLAYER_SPRITES[shopIndex]
    shopPreview.use(sprite(name,{anim:"idle"}))
    shopPreview.pos = PREVIEW_POS
    shopPreview.scale = vec2(PREVIEW_SCALE)
    shopPrice.text = shopButtonLabel(name)
    shopPrice.textSize = save.equipped === name ? 36 : 50
  }

  shopBuy.onClick(() => {
    if (shopFrame.opacity === 0) return
    const name = PLAYER_SPRITES[shopIndex]
    const price = PLAYERS[name].price

    if (save.owned.includes(name)) {
      save.equipped = name
    } else if (save.currency >= price) {
      save.currency -= price
      save.owned.push(name)
    } else {
      shake(4)
      return
    }

    writeSave()
    showShopPreview()
  })


  
  SFCancelBtn.onClick(()=>{
    if (shopFrame.opacity === 0) return;
    shopFrame.opacity = 0;
    SFCancelBtn.opacity = 0;
    shop_left.opacity = 0;
    shop_right.opacity = 0;
    shopPreview.opacity =0;
    shopBuy.opacity = 0;
    shopPrice.opacity = 0;
  })



  const credFrame = add([
    sprite("credFrame"),
    pos(600,100),
    anchor("topright"),
    scale(0.3),
    z(2),
    opacity(0),
  ])

  const CFCancelBtn = credFrame.add([
    sprite("cancelBtn"),
    anchor("topright"),
    pos(-55,45),
    scale(0.1),
    area(),
    z(100),
    opacity(0),
    "btn",

  ])

  CFCancelBtn.onClick(()=>{
    if (credFrame.opacity === 0) return;
    credFrame.opacity = 0;
    CFCancelBtn.opacity = 0;
  })

  const HOVER_GROW = 1.1; 

  onHover("btn", (b)=>{
    if (b.opacity === 0) return;
    setCursor("pointer");
    b.baseScale = b.scale.clone();
    b.scale = b.baseScale.scale(HOVER_GROW);
  })

  onHoverEnd("btn", (b)=>{
    setCursor(CURSOR);
    if (b.baseScale) b.scale = b.baseScale;
  })

  const credBtn = menuButton("credBtn",vec2(166, 312) )
  credBtn.onClick(()=>{
    credFrame.opacity = 1;
    CFCancelBtn.opacity = 1;
  })

  const shopBtn = menuButton("shopBtn",vec2(166, 232) )
  shopBtn.onClick(()=>{
    shopFrame.opacity = 1;
    SFCancelBtn.opacity = 1;
    shop_left.opacity = 1;
    shop_right.opacity = 1;
    shopIndex = 0;
    shopPreview.opacity = 1;
    shopBuy.opacity = 1;
    shopPrice.opacity = 1;
    showShopPreview();
  })


  onClick(()=>{
    if (credFrame.opacity > 0) return
    if (shopFrame.opacity > 0) return
    if (get("btn", { recursive: true }).some((b) => b.isHovering())) return
    go("game_inside");
  });
});

  

  
scene("game_inside",()=>{

  add([
    sprite("bg_inside"),
    pos(0, 0),
    z(-1),
  ])

  const doorVideo = add([
    sprite("door_video"),
    pos(0, 0),
    z(0),
    opacity(0),
  ])

  DOOR_OPN_INSIDE.currentTime = 0
  DOOR_OPN_INSIDE.play().catch(() => doorVideo.destroy())

  doorVideo.onUpdate(() => {
    if (DOOR_OPN_INSIDE.ended || DOOR_OPN_INSIDE.error) {
      doorVideo.destroy()
      return
    }
    if (DOOR_OPN_INSIDE.readyState >= 2 && !DOOR_OPN_INSIDE.seeking) {
      drawVideoFrame(DOOR_OPN_INSIDE)
      doorVideo.opacity = 1
    }
  })

  const stats = PLAYERS[save.equipped]

  const player = add([
    sprite(save.equipped, { anim: "idle" }),
    pos(width() / 2, FLOOR_Y+10),
    scale(0.5 * stats.sizeFix),
    anchor("bot"),
    z(FLOOR_Y + 10),
  ])

  addCurrencyHUD()

  function canEnterDoor(door){
    const blocked = get("npc").some((npc)=> Math.abs(npc.pos.x-door.pos.x) <CLEAR_DIST)
    const inRange = Math.abs(player.pos.x - door.pos.x) <= DOOR_RANGE
    return !blocked && inRange
  }
  

  add([
    sprite("logo"),
    pos(width()/2, 40),
    anchor("center"),
    scale(0.1),
    fixed(),
  ])

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

  const CROWD_OFFSETS = [-25, 0, 25]

  DOORS.forEach((doorX) => {
    CROWD_OFFSETS.forEach((offset) => {
      const y = FLOOR_Y + rand(-6, 6)
      add([
        sprite(choose(NPC_SPRITES), { anim: "idle" }),
        pos(doorX + offset, y),
        scale(0.45),
        anchor("bot"),
        area(),
        z(y),
        "npc",
        {
          crowdX: doorX + offset, 
          cleared: false,
          paid: false,
        },
      ])
    })
  })

  const GRAB_RANGE = 100
  let dragged = []
  const MULTI_GRAB_RADIUS = 40
  let stunTimer = 0

  onMousePress(() => {
    const m = toWorld(mousePos())
    const hit = get("npc")
      .filter((npc) => npc.hasPoint(m))
      .sort((a, b) => b.z - a.z)[0]
    if (!hit) {
      const door = get("door").find((d) => d.hasPoint(m))
      if (door && canEnterDoor(door)) {
        go("game_outside")
      } else if (door) {
        shake(2)
      }
      return
    }

    if (Math.abs(hit.pos.x-player.pos.x)> GRAB_RANGE){
      shake(4)
      stunTimer = 0.1
      return
    }

    const extras = get("npc")
      .filter((npc) => npc !== hit && !npc.cleared &&
        Math.abs(npc.pos.x - hit.pos.x) < MULTI_GRAB_RADIUS)
      .sort((a, b) => Math.abs(a.pos.x - hit.pos.x) - Math.abs(b.pos.x - hit.pos.x))
      .slice(0, stats.maxDrag - 1)

    dragged = [hit, ...extras]
    dragged.forEach((npc) => {
      npc.dragOffsetX = npc.pos.x - m.x
      npc.play("idle")
    })
  })

  onMouseRelease(() => {
    if (dragged.length === 0) return
    dragged.forEach((npc) => {
      const nearDoor = DOORS.some((doorX) => Math.abs(npc.pos.x - doorX) < CLEAR_DIST)
      npc.cleared = !nearDoor
      if (npc.cleared) {
        npc.roamX = npc.pos.x
        npc.roamWait = rand(1, 3)
        if (!npc.paid) {
          save.currency += 1
          npc.paid = true
        }
      }
    })
    writeSave()
    dragged = []
  })


  onUpdate(() => {
    if (dragged.length > 0) {
      setCursor("grabbing")
    } else if (get("npc").some((npc) => npc.hasPoint(toWorld(mousePos())))) {
      setCursor("grab")
    } else if (get("door").some((d) => d.hasPoint(toWorld(mousePos())) && canEnterDoor(d))) {
      setCursor("pointer")
    } else {
      setCursor("default")
    }
  })


  function walkToward(npc, targetX, speed) {
    const dx = targetX - npc.pos.x
    if (Math.abs(dx) > 1) {
      npc.pos.x += Math.sign(dx) * Math.min(speed * dt(), Math.abs(dx))
      npc.flipX = dx < 0
      if (npc.curAnim() !== "walk") npc.play("walk")
      return false
    }
    if (npc.curAnim() !== "idle") npc.play("idle")
    return true
  }


  function pickRoamX(fromX) {
    if (rand() < ROAM_IDLE_CHANCE) return fromX
    for (let i = 0; i < 10; i++) {
      const x = rand(MIN_X, MAX_X)
      if (!DOORS.some((doorX) => Math.abs(x - doorX) < CLEAR_DIST)) return x
    }
    return fromX
  }

  onUpdate("npc", (npc) => {
    if (dragged.includes(npc)) {
      npc.pos.x = clamp(toWorld(mousePos()).x + npc.dragOffsetX, MIN_X, MAX_X)
      return
    }

    if (npc.cleared) {

      if (npc.roamWait > 0) {
        npc.roamWait -= dt()
        if (npc.curAnim() !== "idle") npc.play("idle")
      } else if (walkToward(npc, npc.roamX, ROAM_SPEED)) {
        npc.roamX = pickRoamX(npc.pos.x)
        npc.roamWait = rand(2, 5)
      }
      return
    }


    walkToward(npc, npc.crowdX, NPC_SPEED)
  })

  onUpdate(() => {
    let dir = 0

    if (stunTimer > 0) {
      stunTimer -= dt()
    } else {
      if (isKeyDown("left") || isKeyDown("a")) dir -= 1
      if (isKeyDown("right") || isKeyDown("d")) dir += 1
    }

    player.pos.x = clamp(player.pos.x + dir * stats.speed * dt(), MIN_X, MAX_X)

    if (dir !== 0) {
      player.flipX = dir < 0
      if (player.curAnim() !== "walk") player.play("walk")
    } else if (player.curAnim() !== "idle") {
      player.play("idle")
    }

    camPos(clamp(player.pos.x, width() / 2, BG_WIDTH - width() / 2), height() / 2)
  })

})

scene("game_outside", () => {
  add([
    text("Outside", { size: 32 }),
    pos(width() / 2, height() / 2),
    anchor("center"),
  ])

  addCurrencyHUD()
})



onLoad(() => go("welcome"));