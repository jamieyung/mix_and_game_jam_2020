import Battle from "./src/Battle.js"
import Init from "./src/Init.js"

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600
})

game.scene.add("Init", Init, false)
game.scene.add("Battle", Battle, false)
game.scene.start("Init", {
  floor: 0
})
