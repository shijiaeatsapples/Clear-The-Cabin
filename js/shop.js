
const PRICE_TAG_WIDTH = 34
const PRICE_TEXT_SIZE = 10
// how wide one character of the game's font is, as a share of its text size
const FONT_CHAR_WIDTH = 0.62
const BUY_TEXT_SIZE = 56
// the room on the buy button between its left edge and the coin
const BUY_TEXT_WIDTH = 176

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

function addUpgradePanel(isOpen, selectedPlayer) {
  const { x, y, width: panelWidth, height: panelHeight, rowHeight, rowGap } = UPGRADE_PANEL
  const centerX = x + panelWidth / 2

 
  const shell = [
    add([
      rect(panelWidth, panelHeight, { radius: 8 }),
      pos(x + 4, y + 4),
      color(...PANEL_SHADOW),
      z(3),
      opacity(0),
    ]),
    add([
      rect(panelWidth, panelHeight, { radius: 8 }),
      pos(x, y),
      color(...PANEL_CREAM),
      outline(2, rgb(...NAVY)),
      z(3),
      opacity(0),
    ]),
    add([
      text("Upgrades", { size: 15 }),
      pos(centerX, y + 16),
      anchor("center"),
      color(...NAVY),
      z(4),
      opacity(0),
    ]),
  ]

  const lockedNote = add([
    text("Buy this character to unlock upgrades", { size: 12, width: panelWidth - 16, align: "center" }),
    pos(centerX, y + panelHeight / 2 + 10),
    anchor("center"),
    color(...NAVY),
    z(4),
    opacity(0),
  ])

  function addRow(key, index) {
    const rowWidth = panelWidth - 16
    const row = add([
      rect(rowWidth, rowHeight, { radius: 6 }),
      pos(centerX, y + 34 + rowHeight / 2 + index * (rowHeight + rowGap)),
      anchor("center"),
      color(...PANEL_ROW),
      outline(1, rgb(...NAVY)),
      scale(1),
      area(),
      z(4),
      opacity(0),
      "btn",
    ])

    const addRowPart = (parts) => row.add([...parts, z(1), opacity(0)])
    // the title and price share the top of the row, the description gets the full width below
    const title = addRowPart([
      text("", { size: 9 }),
      pos(-rowWidth / 2 + 6, -rowHeight / 2 + 5),
      anchor("topleft"),
      color(...NAVY),
    ])
    const description = addRowPart([
      text(UPGRADES[key].description, { size: 8 }),
      pos(-rowWidth / 2 + 6, rowHeight / 2 - 5),
      anchor("botleft"),
      color(...NAVY),
    ])
    const priceTag = addRowPart([
      rect(PRICE_TAG_WIDTH, 18, { radius: 5 }),
      pos(rowWidth / 2 - 4 - PRICE_TAG_WIDTH / 2, -rowHeight / 2 + 13),
      anchor("center"),
      color(...NAVY),
    ])
    const priceLabel = priceTag.add([
      text("", { size: PRICE_TEXT_SIZE }),
      anchor("center"),
      opacity(0),
    ])

    row.onClick(() => {
      if (row.opacity === 0) return

      const name = selectedPlayer()
      const cost = upgradeCost(name, key)
      if (save.currency < cost) {
        shake(4)
        return
      }

      save.currency -= cost
      save.upgrades[name] = { ...save.upgrades[name], [key]: upgradeLevel(name, key) + 1 }
      buySound()
      writeSave()
    })

    return {
      refresh(shown) {
        const name = selectedPlayer()
        const cost = upgradeCost(name, key)
        ;[row, title, description, priceTag, priceLabel].forEach((part) => { part.opacity = shown ? 1 : 0 })
        const separator = key === "resistance" ? "\n" : " "
        title.text = `${UPGRADES[key].label}${separator}Lv${upgradeLevel(name, key)}`
        priceLabel.text = formatCurrency(cost)
        // prices grow fast at high levels, so long ones shrink to stay inside the tag
        const widthAtSizeOne = priceLabel.text.length * FONT_CHAR_WIDTH
        priceLabel.textSize = Math.min(PRICE_TEXT_SIZE, (PRICE_TAG_WIDTH - 4) / widthAtSizeOne)
        priceTag.color = rgb(...(save.currency >= cost ? NAVY : PANEL_TOO_EXPENSIVE))
      },
    }
  }

  const rows = Object.keys(UPGRADES).map(addRow)

  onUpdate(() => {
    const open = isOpen()
    const owned = save.owned.includes(selectedPlayer())
    shell.forEach((part) => { part.opacity = open ? 1 : 0 })
    lockedNote.opacity = open && !owned ? 1 : 0
    rows.forEach((row) => row.refresh(open && owned))
  })
}

function addShopMenu(onClose, onEquip) {
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
    text(PLAYERS[PLAYER_NAMES[0]].ability, { size: 28 }),
    pos(-337, 188),
    anchor("center"),
    color(...NAVY),
    z(10),
    opacity(0),
  ])

  const playerName = frame.add([
    text(PLAYERS[PLAYER_NAMES[0]].name, {size:40}),
    pos(-337, 145),
    anchor("center"),
    color(...NAVY),
    z(11),
    opacity(0)
  ])

  addUpgradePanel(isOpen, selectedPlayer)

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
    text(`$${PLAYERS[PLAYER_NAMES[0]].price}`, { size: BUY_TEXT_SIZE }),
    pos(-40, 0),
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
    // long labels like "Equipped" shrink to fit the space beside the coin
    const widthAtSizeOne = price.text.length * FONT_CHAR_WIDTH
    price.textSize = Math.min(BUY_TEXT_SIZE, BUY_TEXT_WIDTH / widthAtSizeOne)
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
      onEquip()
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
