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
