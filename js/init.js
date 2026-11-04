
kaboom({
  width: 640,
  height: 360,
  letterbox: true,
  crisp: true,
  background: [0, 0, 0],
  // js/input.js handles fingers itself, so several can be used at once
  touchToMouse: false,
  // phones can report 3x or more, which is a lot of extra drawing for pixel art
  pixelDensity: Math.min(window.devicePixelRatio || 1, 2),
})
