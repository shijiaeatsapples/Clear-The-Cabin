
const SOUNDS = [
  {name: "bgm", path: ""},
  {name: "btn", path: "sounds/btn.mp3"},
  {name: "buy", path: "sounds/buy.mp3"},
  {name: "closing", path: "sounds/closing.mp3"},
  {name: "coin", path: "sounds/coin.mp3"},
  {name: "footsteps", path: "sounds/footsteps.mp3"},
  {name: "PA", path: "sounds/PA.mp3"},
]

SOUNDS.forEach((m)=>{
  loadSound(m.name, m.path)
})

function startBgm(){
  play("bgm",{
    loop:true,
    volume:0.25
  })
}

let footsteps = null

function setFootsteps(walking){
  if (walking && !footsteps) {
    footsteps = play("footsteps",{
      loop:true,
      volume:1.5
    })
  } else if (!walking && footsteps) {
    footsteps.stop()
    footsteps = null
  }
}

function btnSound(){
  play("btn",{
    volume:1
  })
}

function buySound(){
  play("buy",{
    volume:1
  })
}

function coinSound(){
  play("coin",{
    volume:1
  })
}

function doorClosingSounds(){
  if (round.doorSoundsPlayed) return
  round.doorSoundsPlayed = true

  const announcement = play("PA",{
    volume:1
  })
  announcement.onEnd(() => {
    play("closing",{
      volume:1
    })
  })
}
