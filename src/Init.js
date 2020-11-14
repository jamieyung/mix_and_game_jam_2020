var scene = new Phaser.Scene({ key: "Init" })
var $ = {}
scene.init = function(input) {
  $ = {}
  $.asdf = scene.input.keyboard.addKey("W")
  console.log("Init", input)
}
scene.update = function() {
  if ($.asdf.isDown) {
    scene.scene.start("Battle")
  }
}

export default scene
