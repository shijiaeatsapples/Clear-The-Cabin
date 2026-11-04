// ============================================================================
// Touch input
// ============================================================================

// Kaboom's built-in touch support treats every finger as the mouse, so a second
// finger steals the drag and lifting any finger drops the NPC. Instead, each
// finger is sorted once, when it lands, and keeps that job until it lifts:
//   - on the movement arrows: walks the player, and never touches the mouse
//   - anywhere else: the first one acts as the mouse, any others are ignored

const moveFingers = new Map() // finger id -> x position in game pixels
let mouseFingerId = null

function touchToGame(touch) {
  const box = canvas.getBoundingClientRect()
  const pixelsPerUnit = Math.min(box.width / width(), box.height / height())
  return vec2(
    (touch.clientX - box.left - (box.width - width() * pixelsPerUnit) / 2) / pixelsPerUnit,
    (touch.clientY - box.top - (box.height - height() * pixelsPerUnit) / 2) / pixelsPerUnit,
  )
}

function isInMoveZone(gamePos) {
  // the arrows only exist in the game scenes, so menus never lose a tap to this
  return get("moveIcon").length > 0 &&
    gamePos.x >= MOVE_ICON_LEFT_X - MOVE_ZONE_PADDING_X &&
    gamePos.x <= MOVE_ICON_RIGHT_X + MOVE_ZONE_PADDING_X &&
    Math.abs(gamePos.y - MOVE_ICON_Y) <= MOVE_ZONE_HALF_HEIGHT
}

// a finger drifting while held still counts, so the walk doesn't cut out mid-drag
function isMoveHeld(dir) {
  const middle = (MOVE_ICON_LEFT_X + MOVE_ICON_RIGHT_X) / 2
  return [...moveFingers.values()].some((x) => (x < middle ? -1 : 1) === dir)
}

function sendMouse(type, clientX, clientY) {
  canvas.dispatchEvent(new MouseEvent(type, { clientX, clientY, button: 0, bubbles: true }))
}

function releaseMouseFinger(clientX, clientY) {
  mouseFingerId = null
  sendMouse("mousemove", clientX, clientY)
  sendMouse("mouseup", clientX, clientY)
  // phones have no hover: park the mouse off screen so nothing stays highlighted
  sendMouse("mousemove", -1000, -1000)
}

function onTouchStart(event) {
  event.preventDefault()

  // a finger the browser never reported lifting must not keep the player walking
  const held = new Set([...event.touches].map((touch) => touch.identifier))
  moveFingers.forEach((_, id) => { if (!held.has(id)) moveFingers.delete(id) })
  if (mouseFingerId !== null && !held.has(mouseFingerId)) releaseMouseFinger(-1000, -1000)

  for (const touch of event.changedTouches) {
    const gamePos = touchToGame(touch)
    if (isInMoveZone(gamePos)) {
      moveFingers.set(touch.identifier, gamePos.x)
    } else if (mouseFingerId === null) {
      mouseFingerId = touch.identifier
      sendMouse("mousemove", touch.clientX, touch.clientY)
      sendMouse("mousedown", touch.clientX, touch.clientY)
    }
  }
}

function onTouchMove(event) {
  event.preventDefault()

  for (const touch of event.changedTouches) {
    if (moveFingers.has(touch.identifier)) {
      moveFingers.set(touch.identifier, touchToGame(touch).x)
    } else if (touch.identifier === mouseFingerId) {
      sendMouse("mousemove", touch.clientX, touch.clientY)
    }
  }
}

function onTouchEnd(event) {
  event.preventDefault()

  for (const touch of event.changedTouches) {
    moveFingers.delete(touch.identifier)
    if (touch.identifier === mouseFingerId) releaseMouseFinger(touch.clientX, touch.clientY)
  }
}

function releaseAllFingers() {
  moveFingers.clear()
  if (mouseFingerId !== null) releaseMouseFinger(-1000, -1000)
}

// phones only allow sound to start from inside a real tap
function unlockAudio() {
  if (audioCtx.state === "suspended") audioCtx.resume()
}

canvas.addEventListener("touchstart", onTouchStart, { passive: false })
canvas.addEventListener("touchmove", onTouchMove, { passive: false })
canvas.addEventListener("touchend", onTouchEnd, { passive: false })
canvas.addEventListener("touchcancel", onTouchEnd, { passive: false })

document.addEventListener("touchend", unlockAudio)
document.addEventListener("click", unlockAudio)

// switching apps mid-drag never sends a touchend
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") releaseAllFingers()
})
window.addEventListener("blur", releaseAllFingers)
