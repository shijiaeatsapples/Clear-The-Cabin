// ============================================================================
// Welcome scene
// ============================================================================

scene("welcome", () => {
  setCursor(CURSOR)
  addCurrencyHUD()
  addBackground("bg_inside")

  const walkerScale = 0.6
  const walker = add([
    sprite(save.equipped, { anim: "frt_walk" }),
    anchor("bot"),
    scale(walkerScale),
    pos(center().x, 300),
  ])

  function showEquippedWalker() {
    walker.use(sprite(save.equipped, { anim: "frt_walk" }))
    walker.scale = vec2(walkerScale)
  }

  add([
    sprite("logo"),
    pos(47, 75),
    scale(0.3),
  ])

  const causeBtn = addMenuButton("ourCauseBtn", vec2(166, 272))

  add([
    sprite("enter_label"),
    scale(0.3),
    pos(105, 88),
  ])

  // the click that closes a menu must not also start the game
  let menuClosedAt = -1
  const markMenuClosed = () => { menuClosedAt = time() }

  const shop = addShopMenu(markMenuClosed, showEquippedWalker)
  const credits = addCreditsMenu(markMenuClosed)

  addButtonHoverEffects()

  addMenuButton("credBtn", vec2(166, 312)).onClick(credits.open)
  addMenuButton("shopBtn", vec2(166, 232)).onClick(shop.open)

  // a real tap is needed here, or phones can block the new tab
  const isOnCauseBtn = (gamePos) => !credits.isOpen() && !shop.isOpen() && causeBtn.hasPoint(gamePos)
  const stopListening = listenForRealTap(isOnCauseBtn, () => window.open(CAUSE_URL, "_blank", "noopener"))
  onSceneLeave(stopListening)

  onClick(() => {
    if (get("btn", { recursive: true }).some((b) => b.opacity !== 0 && b.isHovering())) btnSound()
  })

  onClick(() => {
    if (credits.isOpen() || shop.isOpen()) return
    if (time() === menuClosedAt) return
    if (get("btn", { recursive: true }).some((b) => b.opacity !== 0 && b.isHovering())) return
    startNewGame()
    if (save.tutorialDone) {
      startBgm()
      go("game_outside")
    } else {
      go("intro_video")
    }
  })

  if (!save.tutorialDone) {
    INTRO_VID.preload = "auto"
    INTRO_VID.load()
  }
})
