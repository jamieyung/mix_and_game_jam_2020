import { cards } from "./Card.js"
import { floors } from "./Floor.js"

const scene = new Phaser.Scene({ key: "Init" })

let $ = {}

scene.preload = function() {
  scene.load.audio("battle_intro", "./audio/Battle_Theme_Intro_01.ogg")
  scene.load.audio("battle_loop", "./audio/Battle_Theme_Loop_01.ogg")

  scene.load.audio("light_attack_01", "./audio/Light_Attack_01.mp3")
  scene.load.audio("heavy_attack_01", "./audio/Heavy_Attack_01.mp3")
  scene.load.audio("heal", "./audio/Heal_SFX.mp3")
}

// input.floor
scene.create = function(input) {
  console.log("Init", input)
  $ = {}
  $.text_obj = scene.add.text(40, 40, "Press ENTER to start")
  $.text_obj.setFontSize(40)
  $.enter = scene.input.keyboard.addKey("ENTER", true)
}

scene.update = function() {
  if ($.enter.isDown) {
    scene.scene.start("Overworld", {
      floor: floors[0],
      player: {
        max_hp: 20,
        hp: 15,
        deck: [
          cards.poke,
          cards.hit,
          cards.heal,
          cards.leech,
          cards.harden,
          cards.berserk,
          cards.poison,
          cards.mud,
          cards.glass_cannon
        ],
        gold: 0, // TODO
        ult: {}, // TODO
        inventory: {} // TODO
      },
      difficulty: {
        word_length: {
          avg: 4,
          std: 2
        }
      }
    })
  }
}

export default scene
