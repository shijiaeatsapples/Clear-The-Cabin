
const SAVE_KEY = "sit_mrt_save"
const DEFAULT_SAVE = {
  currency: 0,
  owned: ["edward"],
  equipped: "edward",
  upgrades: {},
  highScore: 0,
  tutorialDone: false,
  seaterHintSeen: false,
  firstSurveyRewardClaimed: false,
}

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
