import { EffectType } from "./Card.js"
import { NodeContentsType } from "./Floor.js"
import { StatusEffectType, nameFromType as SEnameFromType } from "./StatusEffect.js"

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
// input.enemy.name
// input.enemy.hp
// input.enemy.deck
// input.enemy.characters_per_second
// input.enemy.casting_cooldown_ms
// input.enemy.n_characters_between_mistakes.avg
// input.enemy.n_characters_between_mistakes.std
// input.floor
// input.playerNodeId

scene.create = function(input) {
  console.log("Battle", input)

  $ = {
    player: {
      max_hp: input.player.max_hp,
      hp: input.player.hp,
      status_effects: {},
      status_effects_text_obj: undefined, //initialised below
      deck: input.player.deck,
      gold: input.player.gold,
      ult: input.player.ult,
      inventory: input.player.inventory,
      hand: [], // initialised below
      handX: 100,
      currentHandCard: undefined,
      health_bar_bg: undefined, // initialised below
      health_bar_fg: undefined, // initialised below
      health_text_obj: undefined, // initialised below
    },
    enemy: {
      name: input.enemy.name,
      max_hp: input.enemy.hp,
      hp: input.enemy.hp,
      status_effects: {},
      status_effects_text_obj: undefined, //initialised below
      deck: input.enemy.deck,
      characters_per_second: input.enemy.characters_per_second,
      casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      cur_casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      n_characters_between_mistakes: input.enemy.n_characters_between_mistakes,
      characters_until_next_mistake: 0, // initialised below
      hand: [], // initialised below
      handX: 500,
      currentHandCard: undefined,
      name_text_obj: undefined, // initialised below
      health_bar_bg: undefined, // initialised below
      health_bar_fg: undefined, // initialised below
      health_text_obj: undefined, // initialised below
      ms_until_next_char: 0,
    },
    music: {
      intro: scene.sound.add("battle_intro", { volume: 0.4 }),
      loop: scene.sound.add("battle_loop", { volume: 0.4, loop: true }),
    },
    audio: {
      light_attack: scene.sound.add("light_attack_01"),
    },
    keys: [],
    down_keys: {},
    floor: input.floor,
    playerNodeId: input.playerNodeId
  }

  $.player.status_effects_text_obj = scene.add.text(100, 60, "").setOrigin(0, 0.5)
  $.player.status_effects_text_obj.setFontSize(20)
  initHand($.player, 100)
  $.player.name_text_obj = scene.add.text(100, 20, "You").setOrigin(0, 0.5)
  $.player.name_text_obj.setFontSize(20)
  $.player.health_bar_bg = scene.add.rectangle(100, 40, 200, 20, 0xe82727).setOrigin(0, 0.5)
  $.player.health_bar_fg = scene.add.rectangle(100, 40, 200, 20, 0x1fcf28).setOrigin(0, 0.5)
  $.player.health_bar_fg.setScale($.player.hp/$.player.max_hp, 1)
  $.player.health_text_obj = scene.add.text(200, 40, $.player.hp + "/" + $.player.max_hp).setOrigin(0.5, 0.5)
  $.player.health_text_obj.setFontSize(20)

  $.enemy.status_effects_text_obj = scene.add.text(500, 60, "").setOrigin(0, 0.5)
  $.enemy.status_effects_text_obj.setFontSize(20)
  recalcEnemyCharactersUntilNextMistake()
  initHand($.enemy, 100)
  $.enemy.name_text_obj = scene.add.text(500, 20, $.enemy.name).setOrigin(0, 0.5)
  $.enemy.name_text_obj.setFontSize(20)
  $.enemy.health_bar_bg = scene.add.rectangle(500, 40, 200, 20, 0xe82727).setOrigin(0, 0.5)
  $.enemy.health_bar_fg = scene.add.rectangle(500, 40, 200, 20, 0x1fcf28).setOrigin(0, 0.5)
  $.enemy.health_text_obj = scene.add.text(600, 40, $.enemy.hp + "/" + $.enemy.hp).setOrigin(0.5, 0.5)
  $.enemy.health_text_obj.setFontSize(20)

  tickStatusEffects(0)

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))

  $.music.intro.once("complete", function() {
    $.music.loop.play()
  })
  $.music.intro.play()
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
  for (let i = 0; i < 50; i++) {
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

  // add the rest of the words
  for (let i = 0; i < args.card.cost - 1; i++) {
    orig_text += " " + Phaser.Math.RND.pick(words)
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

scene.update = function(_, dt) {
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

  tickStatusEffects(dt)

  // Check for end of battle
  if ($.player.hp <= 0) {
    $.music.intro.stop()
    $.music.loop.stop()
    scene.scene.start("Init")
  } else if ($.enemy.hp <= 0) {
    const floor = JSON.parse(JSON.stringify($.floor))
    floor.nodes[$.playerNodeId].contents = { type: NodeContentsType.NONE }
    floor.playerStartNodeId = $.playerNodeId
    $.music.intro.stop()
    $.music.loop.stop()
    scene.scene.start("Overworld", {
      floor: floor,
      player: {
        max_hp: $.player.max_hp,
        hp: $.player.hp,
        deck: $.player.deck,
        gold: $.player.gold,
        ult: $.player.ult,
        inventory: $.player.inventory,
      }
    })
  }
}

function tickStatusEffects(dt) {
  const xs = [$.player, $.enemy]
  for (const target of xs) {
    // recalc/prune effects
    for (const [type, status_effect] of Object.entries(target.status_effects)) {
      const t = Number(type)
      if (t === StatusEffectType.SHIELD) {
        if (status_effect.amount <= 0) delete target.status_effects[type]
      }

      else if (t === StatusEffectType.BERSERK) {
        status_effect.remaining_secs -= dt/1000
        if (status_effect.remaining_secs <= 0) delete target.status_effects[type]
      }

      else if (t === StatusEffectType.POISON) {
        status_effect.remaining_secs -= dt/1000
        if (status_effect.ms_until_next_hit > 0) {
          status_effect.ms_until_next_hit -= dt
        } else {
          status_effect.ms_until_next_hit = status_effect.ms_between_hits
          target.hp = Math.max(0, target.hp - 1)
          redrawHealthBar(target)
        }
        if (status_effect.remaining_secs <= 0) delete target.status_effects[type]
      }
    }

    // compile render string
    let str = ""
    for (const [type, status_effect] of Object.entries(target.status_effects)) {
      const t = Number(type)
      if (str !== "") str += ", "
      const name = SEnameFromType(type)
      if (t === StatusEffectType.SHIELD) str += name + " " + status_effect.amount
      else if (t === StatusEffectType.BERSERK) str += name + " " + status_effect.remaining_secs.toFixed(0)
      else if (t === StatusEffectType.POISON) str += name + " " + status_effect.remaining_secs.toFixed(0)
    }

    target.status_effects_text_obj.text = str
  }
}

function recalcEnemyCharactersUntilNextMistake() {
  const n = $.enemy.n_characters_between_mistakes.avg + $.enemy.n_characters_between_mistakes.std * Phaser.Math.RND.normal()
  $.enemy.characters_until_next_mistake = Math.max(Math.round(n), 1)
}

function executeCardEffect(asPlayer, card) {
  const self = asPlayer ? $.player : $.enemy
  const opponent = asPlayer ? $.enemy : $.player

  let damageAmount = 0
  let berserkDamageWasDone = false

  for (let effect of card.effects) {
    if (effect.type === EffectType.DAMAGE) {
      let amount = effect.amount

      if (self.status_effects[StatusEffectType.BERSERK]) {
        amount *= 2
        berserkDamageWasDone = true
      }

      if (opponent.status_effects[StatusEffectType.SHIELD]) {
        const shield_info = opponent.status_effects[StatusEffectType.SHIELD]
        const shield_amount = shield_info.amount
        shield_info.amount = Math.max(0, shield_info.amount - amount)
        amount = Math.max(0, amount - shield_amount)
      }

      opponent.hp = Math.max(0, opponent.hp - amount)
      redrawHealthBar(opponent)

      damageAmount += amount
    }

    else if (effect.type === EffectType.HEAL) {
      self.hp = Math.min(self.max_hp, self.hp + effect.amount)
      redrawHealthBar(self)
    }

    else if (effect.type === EffectType.LEECH) {
      let amount = effect.amount

      if (self.status_effects[StatusEffectType.BERSERK]) {
        amount *= 2
        berserkDamageWasDone = true
      }

      if (opponent.status_effects[StatusEffectType.SHIELD]) {
        const shield_info = opponent.status_effects[StatusEffectType.SHIELD]
        const shield_amount = shield_info.amount
        shield_info.amount = Math.max(0, shield_info.amount - amount)
        amount = Math.max(0, amount - shield_amount)
      }

      opponent.hp = Math.min(opponent.max_hp, opponent.hp - amount)
      redrawHealthBar(opponent)
      self.hp = Math.min(self.max_hp, self.hp + effect.amount)
      redrawHealthBar(self)

      damageAmount += amount
    }

    else if (effect.type === EffectType.SHIELD) {
      if (!self.status_effects[StatusEffectType.SHIELD]) self.status_effects[StatusEffectType.SHIELD] = { amount: 0 }
      self.status_effects[StatusEffectType.SHIELD].amount += effect.amount
    }

    else if (effect.type === EffectType.BERSERK) {
      if (!self.status_effects[StatusEffectType.BERSERK]) self.status_effects[StatusEffectType.BERSERK] = { remaining_secs: 0 }
      self.status_effects[StatusEffectType.BERSERK].remaining_secs += effect.duration_secs
    }

    else if (effect.type === EffectType.POISON) {
      if (!opponent.status_effects[StatusEffectType.POISON]) opponent.status_effects[StatusEffectType.POISON] = {
        remaining_secs: 0,
        ms_between_hits: 1000,
        ms_until_next_hit: 1000,
      }
      opponent.status_effects[StatusEffectType.POISON].remaining_secs += effect.duration_secs
    }
  }

  if (berserkDamageWasDone) {
    let berserkSelfDamageAmount = damageAmount/2

    if (self.status_effects[StatusEffectType.SHIELD]) {
      const shield_info = self.status_effects[StatusEffectType.SHIELD]
      const shield_amount = shield_info.amount
      shield_info.amount = Math.max(0, shield_info.amount - berserkSelfDamageAmount)
      berserkSelfDamageAmount = Math.max(0, berserkSelfDamageAmount - shield_amount)
    }

    self.hp = Math.min(self.max_hp, self.hp - berserkSelfDamageAmount)
    redrawHealthBar(self)
  }

  // sfx
  if (damageAmount > 0) {
    $.audio.light_attack.play()
  }

  tickStatusEffects(0)
}

function redrawHealthBar(target) {
  target.health_bar_fg.setScale(target.hp/target.max_hp, 1)
  target.health_text_obj.text = target.hp + "/" + target.max_hp
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
