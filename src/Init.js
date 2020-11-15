import { cards } from "./Card.js"
import { floors } from "./Floor.js"

const scene = new Phaser.Scene({ key: "Init" })

let $ = {}

scene.preload = function() {
  scene.load.audio("overworld_loop", "./audio/Overworld_Theme_Loop.ogg")
  scene.load.audio("battle_intro", "./audio/Battle_Theme_Intro_01.ogg")
  scene.load.audio("battle_loop", "./audio/Battle_Theme_Loop_01.ogg")

  scene.load.audio("light_attack", "./audio/Light_Attack_01.mp3")
  scene.load.audio("heavy_attack", "./audio/Heavy_Attack_01.mp3")
  scene.load.audio("shield_hit", "./audio/Shield_Hit_02.mp3")
  scene.load.audio("heal", "./audio/Heal_SFX.mp3")
  scene.load.audio("mistake", "./audio/Mistake_sfx.mp3")
  scene.load.audio("leech", "./audio/leech_sfx.mp3")
  scene.load.audio("berserk", "./audio/Berserk_sfx_01.mp3")
  scene.load.audio("word_length_down", "./audio/Word_Length_Down.mp3")
  scene.load.audio("word_length_up", "./audio/Word_Length_Up.mp3")
  scene.load.audio("slow", "./audio/Slow_Down.mp3")
  scene.load.audio("poison", "./audio/Poison_sfx_02.mp3")

  scene.load.bitmapFont("monoid", "./font/monoid_0.png", "./font/monoid.fnt")

  scene.load.image("hero_front", "./img/hero_front.png")
  scene.load.image("troll", "./img/troll.png")
  scene.load.image("bull", "./img/bull.png")
  scene.load.image("exit", "./img/exit.png")

  scene.load.image("bookworm", "./img/bookworm.png")
  scene.load.image("cobra", "./img/cobra.png")
  scene.load.image("hero_back", "./img/hero_back.png")
  scene.load.image("hippo", "./img/hippo.png")

  scene.load.image("berserk", "./img/berserk.png")
  scene.load.image("damage", "./img/damage.png")
  scene.load.image("glass_cannon", "./img/glass_cannon.png")
  scene.load.image("heal", "./img/heal.png")
  scene.load.image("leech", "./img/leech.png")
  scene.load.image("length_down", "./img/length_down.png")
  scene.load.image("length_up", "./img/length_up.png")
  scene.load.image("poison", "./img/poison.png")
  scene.load.image("shield", "./img/shield.png")
  scene.load.image("slow", "./img/slow.png")
}

// input.floor
scene.create = function(input) {
  console.log("Init", input)
  $ = {}

  $.title_obj = scene.add.bitmapText(400, 150, "monoid", "Type Dungeon").setOrigin(0.5)
  $.title_obj.setTint(0xe0d728)
  $.title_obj.setFontSize(96)

  $.text_obj = scene.add.bitmapText(400, 400, "monoid", "Press ENTER to start").setOrigin(0.5)
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
          // cards.poke,
          cards.hit,
          cards.hit,
          cards.heal,
          // cards.leech,
          cards.harden,
          // cards.berserk,
          cards.poison,
          cards.mud,
          cards.glass_cannon,
          // cards.verbosify,
          // cards.succinct,
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
