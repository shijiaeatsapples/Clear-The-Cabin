// ============================================================================
// Welcome scene
// ============================================================================

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
