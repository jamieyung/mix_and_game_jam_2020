import { cards } from "./Card.js"
import { floors } from "./Floor.js"

const scene = new Phaser.Scene({ key: "Init" })

let $ = {}

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
          cards.hit,
          cards.hit,
          cards.hit,
          cards.heal
        ],
        gold: 0, // TODO
        ult: {}, // TODO
        inventory: {} // TODO
      }
    })
  }
}

export default scene
