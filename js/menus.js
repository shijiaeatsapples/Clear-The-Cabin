
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
