import { EffectType, TargetType } from "./Card.js"

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
      max_hp: input.player.max_hp,
      hp: input.player.hp,
      deck: input.player.deck,
      gold: input.player.gold,
      ult: input.player.ult,
      inventory: input.player.inventory,
      hand: [],
      current_handCard: undefined,
      health_text_obj: undefined // initialised further down
    },
    enemy: {
      max_hp: input.enemy.hp,
      hp: input.enemy.hp,
      deck: input.enemy.deck,
      cps: input.enemy.cps,
      hand: [],
      current_handCard: undefined,
      health_text_obj: undefined // initialised further down
    },
    keys: [],
    down_keys: {}
  }

  $.player.health_text_obj = scene.add.text(40, 40, "Player HP: " + input.player.hp + "/" + input.player.max_hp)
  $.player.health_text_obj.setFontSize(40)

  $.enemy.health_text_obj = scene.add.text(500, 40, "Enemy HP: " + input.enemy.hp)
  $.enemy.health_text_obj.setFontSize(40)

  initHand($.player, 100, 100)
  initHand($.enemy, 600, 100)

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))
}

function initHand(target, x, y) {
  var forbidden_initial_characters = []
  for (let i = 0; i < 6; i++) {
    var handCard = mkHandCard({
      forbidden_initial_characters: forbidden_initial_characters,
      card: Phaser.Math.RND.pick(target.deck),
      scene: scene
    })
    forbidden_initial_characters.push(handCard.orig_text[0])
    handCard.root.x = x
    handCard.root.y = y + i*60
    target.hand.push(handCard)
  }
}

var words = ["Adult","Aeroplane","Air","Airforce","Airport","Album","Alphabet","Apple","Arm","Army","Baby","Backpack","Balloon","Banana","Bank","Barbecue","Bathroom","Bathtub","Bed","Bee","Bird","Bomb","Book","Boss","Bottle","Bowl","Box","Boy","Brain","Bridge","Butterfly","Button","Cappuccino","Car","Carpet","Carrot","Cave","Chair","Chess","Chief","Child","Chisel","Chocolates","Church","Church","Circle","Circus","Circus","Clock","Clown","Coffee","Comet","Compact","Compass","Computer","Crystal","Cup","Cycle","Database","Desk","Diamond","Dress","Drill","Drink","Drum","Dung","Ears","Earth","Egg","Electricity","Elephant","Eraser","Explosive","Eyes","Family","Fan","Feather","Festival","Film","Finger","Fire","Floodlight","Flower","Foot","Fork","Freeway","Fruit","Fungus","Game","Garden","Gas","Gate","Gemstone","Girl","Gloves","God","Grapes","Guitar","Hammer","Hat","Hieroglyph","Highway","Horoscope","Horse","Hose","Ice","Insect","Jet","Junk","Kaleidoscope","Kitchen","Knife","Leather","Leg","Library","Liquid","Magnet","Man","Map","Maze","Meat","Meteor","Microscope","Milk","Milkshake","Mist","Money","Monster","Mosquito","Mouth","Nail","Navy","Necklace","Needle","Onion","PaintBrush","Pants","Parachute","Passport","Pebble","Pendulum","Pepper","Perfume","Pillow","Plane","Planet","Pocket","Post","Potato","Printer","Prison","Pyramid","Radar","Rainbow","Record","Restaurant","Rifle","Ring","Robot","Rock","Rocket","Roof","Room","Rope","Saddle","Salt","Sandpaper","Sandwich","Satellite","School","Sex","Ship","Shoes","Shop","Shower","Signature","Skeleton","Snail","Software","Solid","Space","Spectrum","Sphere","Spice","Spiral","Spoon","Sports","Spot","Square","Staircase","Star","Stomach","Sun","Sunglasses","Surveyor","Swimming","Sword","Table","Tapestry","Teeth","Telescope","Television","Tennis","Thermometer","Tiger","Toilet","Tongue","Torch","Torpedo","Train","Treadmill","Triangle","Tunnel","Typewriter","Umbrella","Vacuum","Vampire","Videotape","Vulture","Water","Weapon","Web","Wheelchair","Window","Woman","Worm"]

// args.forbidden_initial_characters - array of characters (case-insensitive)
// args.card - the card from the deck
function mkHandCard(args) {
  var orig_text
  for (let j = 0; j < 50; j++) {
    orig_text = Phaser.Math.RND.pick(words)
    var conflict_found = false
    var initial_character = orig_text[0].toUpperCase()
    for (var c of args.forbidden_initial_characters) {
      if (c.toUpperCase() === initial_character) {
        conflict_found = true
        break
      }
    }
    if (!conflict_found) break
  }
  var root = scene.add.container(0, 0)

  var card_name_text_obj = scene.add.text(0, 0, args.card.name)
  card_name_text_obj.setFontSize(20)
  root.add(card_name_text_obj)

  var text_obj = scene.add.text(0, 15, orig_text)
  text_obj.setFontSize(40)
  root.add(text_obj)

  return {
    orig_text: orig_text,
    remaining: orig_text,
    card: args.card,
    root: root,
    text_obj: text_obj,
    destroy: function () {
      card_name_text_obj.destroy()
      text_obj.destroy()
      root.destroy()
    }
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
    $.down_keys[keyCode] = key

    if ($.player.current_handCard) {
      var nextKeyCode = $.player.current_handCard.remaining[0].toUpperCase().charCodeAt(0)
      if (nextKeyCode === keyCode) {
        $.player.current_handCard.remaining = $.player.current_handCard.remaining.substring(1)
        $.player.current_handCard.text_obj.text = $.player.current_handCard.remaining
        if ($.player.current_handCard.remaining.length === 0) {
          executeCardEffect(true, $.player.current_handCard.card)
          redrawHandCard($.player.current_handCard)
        }
      } else { // mistake, reset the word
        $.player.current_handCard.remaining = $.player.current_handCard.orig_text
        $.player.current_handCard.text_obj.text = $.player.current_handCard.remaining
        $.player.current_handCard.text_obj.setColor("#ffffff")
        $.player.current_handCard = undefined
      }
    } else {
      // no current handCard, try find one
      for (var handCard of $.player.hand) {
        if (handCard.remaining.length === 0) continue
        var nextKeyCode = handCard.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        handCard.remaining = handCard.remaining.substring(1)
        handCard.text_obj.text = handCard.remaining
        $.player.current_handCard = handCard
        handCard.text_obj.setColor("#55ff55")
        break
      }
    }
  }
}

function executeCardEffect(asPlayer, card) {
  var self = asPlayer ? $.player : $.enemy
  var opponent = asPlayer ? $.enemy : $.player
  var target = card.target === TargetType.SELF ? self : opponent
  var selfText = asPlayer ? "Player" : "Enemy"
  var opponentText = asPlayer ? "Enemy" : "Player"
  var targetText = card.target === TargetType.SELF ? selfText : opponentText

  if (card.effect.type === EffectType.DAMAGE) {
    target.hp = Math.max(0, target.hp - card.effect.amount)
    target.health_text_obj.text = targetText + " HP: " + target.hp
  } else if (card.effect.type === EffectType.HEAL) {
    target.hp = Math.min(target.max_hp, target.hp + card.effect.amount)
    target.health_text_obj.text = targetText + " HP: " + target.hp + "/" + target.max_hp
  }
}

function redrawHandCard(handCard) {
  handCard.destroy()

  var forbidden_initial_characters = []
  for (var otherHandCard of $.player.hand) {
    if (otherHandCard === handCard) continue
    forbidden_initial_characters.push(otherHandCard.orig_text[0])
  }

  var newHandCard = mkHandCard({
    forbidden_initial_characters: forbidden_initial_characters,
    card: Phaser.Math.RND.pick($.player.deck),
    scene: scene
  })

  for (let i = 0; i < $.player.hand.length; i++) {
    if ($.player.hand[i] === handCard) {
      $.player.hand[i] = newHandCard
      newHandCard.root.x = 100
      newHandCard.root.y = 100 + i*60
      break
    }
  }

  $.player.current_handCard = undefined
}

export default scene
