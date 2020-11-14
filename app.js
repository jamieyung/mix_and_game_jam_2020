import Battle from "./src/Battle.js"
import Init from "./src/Init.js"

const game = new Phaser.Game({
  type: Phaser.AUTO,
})

game.scene.add("Init", Init, false)
game.scene.add("Battle", Battle, false)
game.scene.start("Init", 5)
