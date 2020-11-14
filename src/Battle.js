var scene = new Phaser.Scene({ key: "Battle" })
var $ = {}
scene.init = function(input) {
  console.log("Battle", input)

  $ = {
    keys: [],
    down_keys: {}
  }

  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
}
scene.update = function() {
  // Handle keyup events
  for (const [keyCode, key] of Object.entries($.down_keys)) {
    if (key.isDown) continue
    delete $.down_keys[keyCode]
  }

  // Handle keydown events
  for (var key of $.keys) {
    var keyCode = key.keyCode
    if (keyCode in $.down_keys) continue
    if (!key.isDown) continue
    console.log(String.fromCharCode(keyCode))
    $.down_keys[keyCode] = key
  }
}

export default scene
