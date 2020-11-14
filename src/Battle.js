import mkBattleRow from "./Battle/BattleRow.js"

var scene = new Phaser.Scene({ key: "Battle" })

var $ = {}

// Input
//
// Player stats (HP, Deck, Gold, Ult meter, Inventory, Which character you are)
// Enemy stats (HP, Deck, characters per second, Which character they are)
//
// input player.max_hp
// input player.hp
// input.player.deck - an array of Cards
// input.player.gold TODO
// input.player.ult TODO
// input.player.inventory TODO
// input.enemy.hp
// input.enemy.deck
// input.enemy.cps

scene.init = function(input) {
  console.log("Battle", input)

  $ = {
    player: {
      max_hp: input.player.hp,
      hp: input.player.hp,
      deck: input.player.deck,
      gold: input.player.gold,
      ult: input.player.ult,
      inventory: input.player.inventory
    },
    enemy: {
      max_hp: input.enemy.hp,
      hp: input.enemy.hp,
      deck: input.enemy.deck,
      cps: input.enemy.cps
    },
    battleRows: [],
    current_battleRow: undefined,
    keys: [],
    down_keys: {}
  }

  // init battleRows
  var forbidden_initial_characters = []
  for (let i = 0; i < 6; i++) {
    var battleRow = mkBattleRow({
      forbidden_initial_characters: forbidden_initial_characters,
      card: Phaser.Math.RND.pick($.player.deck),
      scene: scene
    })
    forbidden_initial_characters.push(battleRow.orig_text[0])
    battleRow.root.x = 100
    battleRow.root.y = 100 + i*40
    $.battleRows.push(battleRow)
  }

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))

  console.log($)
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

    if ($.current_battleRow) {
      var nextKeyCode = $.current_battleRow.remaining[0].toUpperCase().charCodeAt(0)
      if (nextKeyCode === keyCode) {
        $.current_battleRow.remaining = $.current_battleRow.remaining.substring(1)
        $.current_battleRow.text_obj.text = $.current_battleRow.remaining
        if ($.current_battleRow.remaining.length === 0) {
          redrawBattleRow($.current_battleRow)
        }
      } else {
        redrawBattleRow($.current_battleRow)
      }
    } else {
      // no current battleRow, try find one
      for (var battleRow of $.battleRows) {
        if (battleRow.remaining.length === 0) continue
        var nextKeyCode = battleRow.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        battleRow.remaining = battleRow.remaining.substring(1)
        battleRow.text_obj.text = battleRow.remaining
        $.current_battleRow = battleRow
        battleRow.text_obj.setColor("#55ff55")
        break
      }
    }
  }
}

function redrawBattleRow(battleRow) {
  battleRow.destroy()

  var forbidden_initial_characters = []
  for (var otherBattleRow of $.battleRows) {
    if (otherBattleRow === battleRow) continue
    forbidden_initial_characters.push(otherBattleRow.orig_text[0])
  }

  var newBattleRow = mkBattleRow({
    forbidden_initial_characters: forbidden_initial_characters,
    card: Phaser.Math.RND.pick($.player.deck),
    scene: scene
  })

  for (let i = 0; i < $.battleRows.length; i++) {
    if ($.battleRows[i] === battleRow) {
      $.battleRows[i] = newBattleRow
      newBattleRow.root.x = 100
      newBattleRow.root.y = 100 + i*40
      break
    }
  }

  $.current_battleRow = undefined
}

export default scene
