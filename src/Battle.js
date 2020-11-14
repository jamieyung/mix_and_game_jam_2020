import mkCard from "./Battle/Card.js"

var scene = new Phaser.Scene({ key: "Battle" })

var $ = {}

// Input
//
// Player stats (HP, Deck, Gold, Ult meter, Inventory, Which character you are)
// Enemy stats (HP, Deck, Which character they are)

scene.init = function(input) {
  console.log("Battle", input)

  $ = {
    cards: [],
    current_card: undefined,
    keys: [],
    down_keys: {}
  }

  // init cards
  // TODO deal with words having the same starting character (prevent)
  var forbidden_initial_characters = []
  for (let i = 0; i < 6; i++) {
    var card = mkCard({
      forbidden_initial_characters: forbidden_initial_characters,
      scene: scene
    })
    forbidden_initial_characters.push(card.orig_text[0])
    card.text_obj.x = 100
    card.text_obj.y = 100 + i*40
    $.cards.push(card)
  }

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))
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

    if ($.current_card) {
      var nextKeyCode = $.current_card.remaining[0].toUpperCase().charCodeAt(0)
      if (nextKeyCode === keyCode) {
        $.current_card.remaining = $.current_card.remaining.substring(1)
        $.current_card.text_obj.text = $.current_card.remaining
        if ($.current_card.remaining.length === 0) {
          redrawCard($.current_card)
        }
      } else {
        redrawCard($.current_card)
      }
    } else {
      // no current card, try find one
      for (var card of $.cards) {
        if (card.remaining.length === 0) continue
        var nextKeyCode = card.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        card.remaining = card.remaining.substring(1)
        card.text_obj.text = card.remaining
        $.current_card = card
        card.text_obj.setColor("#55ff55")
        break
      }
    }
  }
}

function redrawCard(card) {
  card.text_obj.destroy()

  var forbidden_initial_characters = []
  for (var otherCard of $.cards) {
    if (otherCard === card) continue
    forbidden_initial_characters.push(otherCard.orig_text[0])
  }

  var newCard = mkCard({
    forbidden_initial_characters: forbidden_initial_characters,
    scene: scene
  })

  for (let i = 0; i < $.cards.length; i++) {
    if ($.cards[i] === card) {
      $.cards[i] = newCard
      newCard.text_obj.x = 100
      newCard.text_obj.y = 100 + i*40
      break
    }
  }

  $.current_card = undefined
}

export default scene
