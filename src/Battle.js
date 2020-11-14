var scene = new Phaser.Scene({ key: "Battle" })
var $ = {}
scene.init = function(input) {
  console.log("Battle", input)

  $ = {
    phrase: "HELLO WORLD",
    keys: [],
    down_keys: {}
  }

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
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
    if ($.phrase.length > 0) {
      var nextKeyCode = $.phrase.charCodeAt(0)
      if (nextKeyCode == keyCode) {
        $.phrase = $.phrase.substring(1)
      }
    }
    console.log(String.fromCharCode(keyCode), $.phrase)
    $.down_keys[keyCode] = key
  }
}

export default scene
