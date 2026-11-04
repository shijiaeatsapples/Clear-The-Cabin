
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
      button.label.text = `${label} Lv${level}\n$${upgradeCost(name, button.upgradeKey)}`
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
