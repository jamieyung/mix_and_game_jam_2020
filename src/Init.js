var scene = new Phaser.Scene({ key: "Init" })
var $ = {}
scene.init = function(input) {
  $ = {}
  console.log("Init", input)
}
scene.update = function() {
  scene.scene.start("Battle")
}

export default scene
