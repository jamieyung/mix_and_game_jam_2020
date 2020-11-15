import { EffectType, TargetType } from "./Card.js"

const scene = new Phaser.Scene({ key: "Battle" })

let $ = {}

// Input
//
// Player stats (HP, Deck, Gold, Ult meter, Inventory, Which character you are)
// Enemy stats (HP, Deck, characters per second, Which character they are)
//
// input.player.max_hp
// input.player.hp
// input.player.deck - an array of Cards
// input.player.gold TODO
// input.player.ult TODO
// input.player.inventory TODO
// input.enemy.name TODO
// input.enemy.hp
// input.enemy.deck
// input.enemy.characters_per_second
// input.enemy.casting_cooldown_ms
// input.enemy.n_characters_between_mistakes.avg
// input.enemy.n_characters_between_mistakes.std

scene.create = function(input) {
  console.log("Battle", input)

  $ = {
    player: {
      max_hp: input.player.max_hp,
      hp: input.player.hp,
      deck: input.player.deck,
      gold: input.player.gold,
      ult: input.player.ult,
      inventory: input.player.inventory,
      hand: [], // initialised below
      handX: 100,
      currentHandCard: undefined,
      health_text_obj: undefined, // initialised below
    },
    enemy: {
      max_hp: input.enemy.hp,
      hp: input.enemy.hp,
      deck: input.enemy.deck,
      characters_per_second: input.enemy.characters_per_second,
      casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      cur_casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      n_characters_between_mistakes: input.enemy.n_characters_between_mistakes,
      characters_until_next_mistake: 0, // initialised below
      hand: [], // initialised below
      handX: 600,
      currentHandCard: undefined,
      health_text_obj: undefined, // initialised below
      ms_until_next_char: 0
    },
    keys: [],
    down_keys: {}
  }

  initHand($.player, 100)
  $.player.health_text_obj = scene.add.text(40, 40, "Player HP: " + input.player.hp + "/" + input.player.max_hp)
  $.player.health_text_obj.setFontSize(40)

  recalcEnemyCharactersUntilNextMistake()
  initHand($.enemy, 100)
  $.enemy.health_text_obj = scene.add.text(500, 40, "Enemy HP: " + input.enemy.hp + "/" + input.enemy.hp)
  $.enemy.health_text_obj.setFontSize(40)

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))
}

function initHand(target, y) {
  const forbidden_initial_characters = []
  for (let i = 0; i < 6; i++) {
    const handCard = mkHandCard({
      forbidden_initial_characters: forbidden_initial_characters,
      card: Phaser.Math.RND.pick(target.deck),
      scene: scene
    })
    forbidden_initial_characters.push(handCard.orig_text[0])
    handCard.root.x = target.handX
    handCard.root.y = y + i*60
    target.hand.push(handCard)
  }
}

const words = ["Adult","Aeroplane","Air","Airforce","Airport","Album","Alphabet","Apple","Arm","Army","Baby","Backpack","Balloon","Banana","Bank","Barbecue","Bathroom","Bathtub","Bed","Bee","Bird","Bomb","Book","Boss","Bottle","Bowl","Box","Boy","Brain","Bridge","Butterfly","Button","Cappuccino","Car","Carpet","Carrot","Cave","Chair","Chess","Chief","Child","Chisel","Chocolates","Church","Church","Circle","Circus","Circus","Clock","Clown","Coffee","Comet","Compact","Compass","Computer","Crystal","Cup","Cycle","Database","Desk","Diamond","Dress","Drill","Drink","Drum","Dung","Ears","Earth","Egg","Electricity","Elephant","Eraser","Explosive","Eyes","Family","Fan","Feather","Festival","Film","Finger","Fire","Floodlight","Flower","Foot","Fork","Freeway","Fruit","Fungus","Game","Garden","Gas","Gate","Gemstone","Girl","Gloves","God","Grapes","Guitar","Hammer","Hat","Hieroglyph","Highway","Horoscope","Horse","Hose","Ice","Insect","Jet","Junk","Kaleidoscope","Kitchen","Knife","Leather","Leg","Library","Liquid","Magnet","Man","Map","Maze","Meat","Meteor","Microscope","Milk","Milkshake","Mist","Money","Monster","Mosquito","Mouth","Nail","Navy","Necklace","Needle","Onion","PaintBrush","Pants","Parachute","Passport","Pebble","Pendulum","Pepper","Perfume","Pillow","Plane","Planet","Pocket","Post","Potato","Printer","Prison","Pyramid","Radar","Rainbow","Record","Restaurant","Rifle","Ring","Robot","Rock","Rocket","Roof","Room","Rope","Saddle","Salt","Sandpaper","Sandwich","Satellite","School","Sex","Ship","Shoes","Shop","Shower","Signature","Skeleton","Snail","Software","Solid","Space","Spectrum","Sphere","Spice","Spiral","Spoon","Sports","Spot","Square","Staircase","Star","Stomach","Sun","Sunglasses","Surveyor","Swimming","Sword","Table","Tapestry","Teeth","Telescope","Television","Tennis","Thermometer","Tiger","Toilet","Tongue","Torch","Torpedo","Train","Treadmill","Triangle","Tunnel","Typewriter","Umbrella","Vacuum","Vampire","Videotape","Vulture","Water","Weapon","Web","Wheelchair","Window","Woman","Worm"]

// args.forbidden_initial_characters - array of characters (case-insensitive)
// args.card - the card from the deck
function mkHandCard(args) {
  let orig_text
  for (let j = 0; j < 50; j++) {
    orig_text = Phaser.Math.RND.pick(words)
    let conflict_found = false
    const initial_character = orig_text[0].toUpperCase()
    for (let c of args.forbidden_initial_characters) {
      if (c.toUpperCase() === initial_character) {
        conflict_found = true
        break
      }
    }
    if (!conflict_found) break
  }
  const root = scene.add.container(0, 0)

  const card_name_text_obj = scene.add.text(0, 0, args.card.name)
  card_name_text_obj.setFontSize(20)
  root.add(card_name_text_obj)

  const text_obj = scene.add.text(0, 15, orig_text)
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

scene.update = function(time, dt) {
  // Handle keyup events
  for (const [keyCode, key] of Object.entries($.down_keys)) {
    if (key.isDown) continue
    delete $.down_keys[keyCode]
  }

  // Handle keydown events
  for (let key of $.keys) {
    const keyCode = key.keyCode
    if (keyCode in $.down_keys) continue
    if (!key.isDown) continue
    $.down_keys[keyCode] = key

    if ($.player.currentHandCard) {
      const nextKeyCode = $.player.currentHandCard.remaining[0].toUpperCase().charCodeAt(0)
      if (nextKeyCode === keyCode) {
        $.player.currentHandCard.remaining = $.player.currentHandCard.remaining.substring(1)
        $.player.currentHandCard.text_obj.text = $.player.currentHandCard.remaining
        if ($.player.currentHandCard.remaining.length === 0) {
          executeCardEffect(true, $.player.currentHandCard.card)
          redrawCurrentHandCard($.player)
        }
      } else { // mistake, reset the word
        $.player.currentHandCard.remaining = $.player.currentHandCard.orig_text
        $.player.currentHandCard.text_obj.text = $.player.currentHandCard.remaining
        $.player.currentHandCard.text_obj.setColor("#ffffff")
        $.player.currentHandCard = undefined
      }
    } else {
      // no current handCard, try find one
      for (let handCard of $.player.hand) {
        if (handCard.remaining.length === 0) continue
        const nextKeyCode = handCard.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        handCard.remaining = handCard.remaining.substring(1)
        handCard.text_obj.text = handCard.remaining
        $.player.currentHandCard = handCard
        handCard.text_obj.setColor("#55ff55")
        break
      }
    }
  }

  // Enemy update
  if ($.enemy.currentHandCard) {
    if ($.enemy.ms_until_next_char > 0) {
      $.enemy.ms_until_next_char -= dt
    } else { // make enemy type a character
      $.enemy.ms_until_next_char = 1000 / $.enemy.characters_per_second
      if ($.enemy.characters_until_next_mistake > 0) { // successful keystroke
        $.enemy.characters_until_next_mistake--
        $.enemy.currentHandCard.remaining = $.enemy.currentHandCard.remaining.substring(1)
        $.enemy.currentHandCard.text_obj.text = $.enemy.currentHandCard.remaining
        if ($.enemy.currentHandCard.remaining.length === 0) {
          executeCardEffect(false, $.enemy.currentHandCard.card)
          redrawCurrentHandCard($.enemy)
          $.enemy.cur_casting_cooldown_ms = $.enemy.casting_cooldown_ms
        }
      } else { // mistake, reset the word
        recalcEnemyCharactersUntilNextMistake()
        $.enemy.currentHandCard.remaining = $.enemy.currentHandCard.orig_text
        $.enemy.currentHandCard.text_obj.text = $.enemy.currentHandCard.remaining
        $.enemy.currentHandCard.text_obj.setColor("#ffffff")
        $.enemy.currentHandCard = undefined
        $.enemy.cur_casting_cooldown_ms = $.enemy.casting_cooldown_ms
      }
    }
  } else { // no currentHandCard
    if ($.enemy.cur_casting_cooldown_ms > 0) {
      $.enemy.cur_casting_cooldown_ms -= dt
    } else {
      $.enemy.currentHandCard = Phaser.Math.RND.pick($.enemy.hand)
      $.enemy.currentHandCard.text_obj.setColor("#55ff55")
    }
  }

  // Check for end of battle
  if ($.player.hp <= 0) {
    scene.scene.start("Init")
  } else if ($.enemy.hp <= 0) {
    scene.scene.start("Init")
  }
}

function recalcEnemyCharactersUntilNextMistake() {
  const n = $.enemy.n_characters_between_mistakes.avg + $.enemy.n_characters_between_mistakes.std * Phaser.Math.RND.normal()
  $.enemy.characters_until_next_mistake = Math.max(Math.round(n), 1)
}

function executeCardEffect(asPlayer, card) {
  const self = asPlayer ? $.player : $.enemy
  const opponent = asPlayer ? $.enemy : $.player
  const target = card.target === TargetType.SELF ? self : opponent
  const selfText = asPlayer ? "Player" : "Enemy"
  const opponentText = asPlayer ? "Enemy" : "Player"
  const targetText = card.target === TargetType.SELF ? selfText : opponentText

  if (card.effect.type === EffectType.DAMAGE) {
    target.hp = Math.max(0, target.hp - card.effect.amount)
    target.health_text_obj.text = targetText + " HP: " + target.hp + "/" + target.max_hp
  } else if (card.effect.type === EffectType.HEAL) {
    target.hp = Math.min(target.max_hp, target.hp + card.effect.amount)
    target.health_text_obj.text = targetText + " HP: " + target.hp + "/" + target.max_hp
  }
}

function redrawCurrentHandCard(target) {
  if (!target.currentHandCard) return
  target.currentHandCard.destroy()

  const forbidden_initial_characters = []
  for (let otherHandCard of target.hand) {
    if (otherHandCard === target.currentHandCard) continue
    forbidden_initial_characters.push(otherHandCard.orig_text[0])
  }

  const newHandCard = mkHandCard({
    forbidden_initial_characters: forbidden_initial_characters,
    card: Phaser.Math.RND.pick(target.deck),
    scene: scene
  })

  for (let i = 0; i < target.hand.length; i++) {
    if (target.hand[i] === target.currentHandCard) {
      target.hand[i] = newHandCard
      newHandCard.root.x = target.handX
      newHandCard.root.y = 100 + i*60
      break
    }
  }

  target.currentHandCard = undefined
}

export default scene
