import Init from "./src/Init.js"
import Overworld from "./src/Overworld.js"
import Battle from "./src/Battle.js"

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600
})

game.scene.add("Init", Init, false)
game.scene.add("Overworld", Overworld, false)
game.scene.add("Battle", Battle, false)
game.scene.start("Init")
