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
      floorId: 0
    })
  }
}

export default scene
