import { getCardById } from "./Card.js"

var scene = new Phaser.Scene({ key: "Init" })

var $ = {}

scene.init = function(input) {
  console.log("Init", input)
  $ = {}
  $.text_obj = scene.add.text(40, 40, "Press ENTER to start")
  $.text_obj.setFontSize(40)
  $.enter = scene.input.keyboard.addKey("ENTER", true)
}

scene.update = function() {
  if ($.enter.isDown) {
    scene.scene.start("Battle", {
      player: {
        max_hp: 20,
        hp: 15,
        deck: [
          getCardById(0),
          getCardById(0),
          getCardById(0),
          getCardById(1),
        ],
        gold: 0, // TODO
        ult: {}, // TODO
        inventory: {} // TODO
      },
      enemy: {
        hp: 10,
        deck: [
          getCardById(1),
          getCardById(2),
        ],
        characters_per_second: 6,
        casting_cooldown_ms: 500,
        n_characters_between_mistakes: {
          avg: 60,
          std: 5
        }
      }
    })
  }
}

export default scene
