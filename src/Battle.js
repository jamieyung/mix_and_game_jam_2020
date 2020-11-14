var scene = new Phaser.Scene({ key: "Battle" })
var $ = {}
scene.init = function(input) {
  $ = {}
  $.asdf = scene.input.keyboard.addKey("W")
  console.log("Battle", input)
}
scene.update = function() {
  if ($.asdf.isDown) {
    scene.scene.start("Init")
  }
}

export default scene
