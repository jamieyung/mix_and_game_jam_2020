import { cards } from "./Card.js"
import { enemies } from "./Enemy.js"

var scene = new Phaser.Scene({ key: "Init" })

var $ = {}

// input.floor
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
          cards.hit,
          cards.heal
        ],
        gold: 0, // TODO
        ult: {}, // TODO
        inventory: {} // TODO
      },
      enemy: enemies.enemy1
    })
  }
}

export default scene
