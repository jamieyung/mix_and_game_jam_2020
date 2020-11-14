import { getCardById } from "./Card.js"

var scene = new Phaser.Scene({ key: "Init" })

scene.init = function(input) {
  console.log("Init", input)
}

scene.update = function() {
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
      typing_success_rate: 0.98
    }
  })
}

export default scene
