import { EffectType } from "./Card.js"
import { NodeContentsType } from "./Floor.js"
import { StatusEffectType, nameFromType as SEnameFromType } from "./StatusEffect.js"
import { getRandomWord } from "./Words.js"

const scene = new Phaser.Scene({ key: "Battle" })

const cardSpacing = 75
const letterSpacing = 15

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
// input.difficulty.word_length.avg
// input.difficulty.word_length.std

scene.create = function(input) {
  console.log("Battle", input)

  scene.sound.pauseOnBlur = false

  $ = {
    prefight_intro_ms_left: 3000,
    prefight_layer: undefined, // initialised below
    player: {
      max_hp: input.player.max_hp,
      hp: input.player.hp,
      status_effects: {},
      deck: input.player.deck,
      gold: input.player.gold,
      ult: input.player.ult,
      inventory: input.player.inventory,
      hand: [], // initialised below
      handX: 50,
      handY: 30,
      currentHandCard: undefined,
      name_text_obj: undefined, // initialised below
      health_bar_bg: undefined, // initialised below
      health_bar_fg: undefined, // initialised below
      health_text_obj: undefined, // initialised below
      status_effects_text_obj: undefined, //initialised below
      character_sprite: undefined, // initialised below
    },
    enemy: {
      id: input.enemy.id,
      name: input.enemy.name,
      max_hp: input.enemy.hp,
      hp: input.enemy.hp,
      status_effects: {},
      deck: input.enemy.deck,
      characters_per_second: input.enemy.characters_per_second,
      casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      cur_casting_cooldown_ms: input.enemy.casting_cooldown_ms,
      n_characters_between_mistakes: input.enemy.n_characters_between_mistakes,
      characters_until_next_mistake: 0, // initialised below
      hand: [], // initialised below
      handX: 430,
      handY: 140,
      currentHandCard: undefined,
      name_text_obj: undefined, // initialised below
      health_bar_bg: undefined, // initialised below
      health_bar_fg: undefined, // initialised below
      health_text_obj: undefined, // initialised below
      status_effects_text_obj: undefined, //initialised below
      character_sprite: undefined, // initialised below
      ms_until_next_char: 0,
    },
    music: {
      intro: scene.sound.add("battle_intro", { volume: 0.4 }),
      loop: scene.sound.add("battle_loop", { volume: 0.4, loop: true }),
    },
    hands_layer: undefined, // initialised below
    icons_layer: undefined, // initialised below
    keys: [],
    down_keys: {},
    floor: input.floor,
    playerNodeId: input.playerNodeId,
    difficulty: input.difficulty
  }

  $.player.name_text_obj = scene.add.bitmapText(150, 520, "monoid", "You").setOrigin(0, 0.5)
  $.player.name_text_obj.setFontSize(20)
  $.player.health_bar_bg = scene.add.rectangle(150, 540, 200, 20, 0xe82727).setOrigin(0, 0.5)
  $.player.health_bar_fg = scene.add.rectangle(150, 540, 200, 20, 0x1fcf28).setOrigin(0, 0.5)
  $.player.health_bar_fg.setScale($.player.hp/$.player.max_hp, 1)
  $.player.health_text_obj = scene.add.bitmapText(250, 540, "monoid", $.player.hp + "/" + $.player.max_hp).setOrigin(0.5, 0.5)
  $.player.health_text_obj.setFontSize(20)
  $.player.status_effects_text_obj = scene.add.bitmapText(150, 560, "monoid", "").setOrigin(0, 0.5)
  $.player.status_effects_text_obj.setFontSize(20)
  $.player.character_sprite = scene.add.image(100, 550, "hero_back")
  $.player.character_sprite.setScale(0.1)

  recalcEnemyCharactersUntilNextMistake()
  $.enemy.name_text_obj = scene.add.bitmapText(430, 60, "monoid", $.enemy.name).setOrigin(0, 0.5)
  $.enemy.name_text_obj.setFontSize(20)
  $.enemy.health_bar_bg = scene.add.rectangle(430, 80, 200, 20, 0xe82727).setOrigin(0, 0.5)
  $.enemy.health_bar_fg = scene.add.rectangle(430, 80, 200, 20, 0x1fcf28).setOrigin(0, 0.5)
  $.enemy.health_text_obj = scene.add.bitmapText(530, 80, "monoid", $.enemy.hp + "/" + $.enemy.hp).setOrigin(0.5, 0.5)
  $.enemy.health_text_obj.setFontSize(20)
  $.enemy.status_effects_text_obj = scene.add.bitmapText(430, 100, "monoid", "").setOrigin(0, 0.5)
  $.enemy.status_effects_text_obj.setFontSize(20)
  $.enemy.character_sprite = scene.add.image(710, 90, $.enemy.id)
  $.enemy.character_sprite.setScale(0.08)

  $.hands_layer = scene.add.container(0, 0)
  $.icons_layer = scene.add.container(0, 0)
  initHand($.player)
  initHand($.enemy)

  tickStatusEffects(0)

  // init key listeners
  for (let i = 65; i <= 90; i++) {
    $.keys.push(scene.input.keyboard.addKey(String.fromCharCode(i), true))
  }
  $.keys.push(scene.input.keyboard.addKey("SPACE", true))
  $.keys.push(scene.input.keyboard.addKey("ENTER", true))

  $.prefight_layer = scene.add.container(0, 0)
  const prefight_bg = scene.add.rectangle(400, 300, 400, 300, 0xe0d728).setOrigin(0.5, 0.5)
  $.prefight_layer.add(prefight_bg)

  const prefight_text = scene.add.bitmapText(400, 300, "monoid", "Type the words\nin the boxes on\nthe left!")
    .setOrigin(0.5, 0.5)
    .setFontSize(40)
    .setCenterAlign()
  $.prefight_layer.add(prefight_text)

  $.music.intro.once("complete", function() {
    $.music.loop.play({ volume: 0.4, loop: true })
  })
  $.music.intro.play()
}

function initHand(target) {
  const forbidden_initial_characters = []
  for (let i = 0; i < 6; i++) {
    const handCard = mkHandCard({
      forbidden_initial_characters: forbidden_initial_characters,
      card: Phaser.Math.RND.pick(target.deck),
      word_length_avg: $.difficulty.word_length.avg,
      word_length_std: $.difficulty.word_length.std,
    })
    forbidden_initial_characters.push(handCard.orig_text[0])
    handCard.root.x = target.handX
    handCard.root.y = target.handY + i*cardSpacing
    $.hands_layer.add(handCard.root)
    target.hand.push(handCard)
  }
}

const CardState = {
  READY: 0,
  DELETING_CHAR: 1,
  DONE_DELETING_CHAR: 2,
  DOING_MISTAKE_ANIM: 3,
  DONE_MISTAKE_ANIM: 4,
  DOING_EXECUTE_ANIM: 5,
  DONE_EXECUTE_ANIM: 6,
}

// args.forbidden_initial_characters - array of characters (case-insensitive)
// args.card - the card from the deck
// args.word_length_avg
// args.word_length_std
function mkHandCard(args) {
  const orig_text = generateWords(args.forbidden_initial_characters, args.card.cost, args.word_length_avg, args.word_length_std)

  const root = scene.add.container(0, 0)

  const anim_container = scene.add.container(0, 0)
  root.add(anim_container)

  const card_bg = scene.add.rectangle(0, 0, 330, 50, 0x256da8).setOrigin(0, 0)
  anim_container.add(card_bg)

  const card_name_text_obj = scene.add.bitmapText(5, 5, "monoid", args.card.name)
  card_name_text_obj.setTint(0xe0d728)
  card_name_text_obj.setScale(0.2)
  anim_container.add(card_name_text_obj)

  const char_objs = []
  for (let i = 0; i < orig_text.length; i++) {
    const char_obj = scene.add.bitmapText(5 + i*letterSpacing, 20, "monoid", orig_text[i])
    char_obj.setScale(0.3)
    anim_container.add(char_obj)
    char_objs.push(char_obj)
  }

  const icons = []
  for (let i = 0; i < args.card.effects.length; i++) {
    const effect = args.card.effects[i]
    let str = ""
    if (effect.type === EffectType.DAMAGE) str = "damage"
    else if (effect.type === EffectType.HEAL) str = "heal"
    else if (effect.type === EffectType.LEECH) str = "leech"
    else if (effect.type === EffectType.APPLY_STATUS_EFFECT) {
      const t = Number(effect.status_effect_type)
      if (t === StatusEffectType.SHIELD) str = "shield"
      else if (t === StatusEffectType.BERSERK) str = "berserk"
      else if (t === StatusEffectType.POISON) str = "poison"
      else if (t === StatusEffectType.SLOW) str = "slow"
      else if (t === StatusEffectType.GLASS_CANNON) str = "glass_cannon"
      else if (t === StatusEffectType.LENGTH) {
        str = (effect.delta_length > 0) ? "length_up" : "length_down"
      }
    }
    const effect_icon_img = scene.add.image(315 - i * 30, 0, str)
    effect_icon_img.setScale(0.3)
    anim_container.add(effect_icon_img)
    icons.push({
      effect: effect,
      img: effect_icon_img,
    })
  }

  return {
    orig_text: orig_text,
    remaining: orig_text,
    card: args.card,
    root: root,
    anim_container: anim_container,
    char_objs: char_objs,
    icons: icons,
    state: CardState.READY,
    destroy: function () {
      root.removeAll(true)
      root.destroy()
      for (let icon of icons) {
        icon.img.destroy()
      }
    }
  }
}

function remakeCardCharObjsBasedOnRemaining(card) {
  for (let x of card.char_objs) x.destroy()
  card.char_objs = []
  for (let i = 0; i < card.remaining.length; i++) {
    const char_obj = scene.add.bitmapText(5 + i*letterSpacing, 20, "monoid", card.remaining[i])
    char_obj.setScale(0.3)
    card.anim_container.add(char_obj)
    card.char_objs.push(char_obj)
  }
}

scene.update = function(_, dt) {
  if ($.prefight_intro_ms_left > 0) {
    $.prefight_intro_ms_left -= dt
    return
  } else if (!!$.prefight_layer) {
    $.prefight_layer.removeAll(true)
    $.prefight_layer = null
  }

  if ($.battle_ended) {
    if ($.postfight_intro_ms_left > 0) {
      $.postfight_intro_ms_left -= dt
      return
    } else {
      cleanup()
      if ($.battle_lost) {
        scene.scene.start("Init")
      } else {
        const floor = JSON.parse(JSON.stringify($.floor))
        floor.nodes[$.playerNodeId].contents = { type: NodeContentsType.NONE }
        floor.playerStartNodeId = $.playerNodeId
        scene.scene.start("Overworld", {
          floor: floor,
          player: {
            max_hp: $.player.max_hp,
            hp: $.player.hp,
            deck: $.player.deck,
            gold: $.player.gold,
            ult: $.player.ult,
            inventory: $.player.inventory,
          },
          difficulty: $.difficulty,
        })
      }
    }
  }

  // Handle keyup events
  for (const [keyCode, key] of Object.entries($.down_keys)) {
    if (key.isDown) continue
    delete $.down_keys[keyCode]
  }

  // currentHandCard anim exit logic
  const xs = [$.player, $.enemy]
  for (const target of xs) {
    if (!target.currentHandCard) continue
    if (target.currentHandCard.state === CardState.DONE_DELETING_CHAR) {
      target.currentHandCard.state = CardState.READY
      let head_char_obj = target.currentHandCard.char_objs.shift()
      head_char_obj.destroy()
      for (let x of target.currentHandCard.char_objs) x.x -= letterSpacing
      if (target.currentHandCard.remaining.length === 0) {
        const asPlayer = target === $.player
        executeCardEffect(asPlayer, target.currentHandCard)
        if (target === $.enemy) {
          $.enemy.cur_casting_cooldown_ms = $.enemy.casting_cooldown_ms
        }
      }
    }

    else if (target.currentHandCard.state === CardState.DONE_MISTAKE_ANIM) {
      target.currentHandCard.state = CardState.READY
      target.currentHandCard.anim_container.x = 0
      target.currentHandCard.anim_container.y = 0
      target.currentHandCard.remaining = target.currentHandCard.orig_text
      remakeCardCharObjsBasedOnRemaining(target.currentHandCard)
      target.currentHandCard = undefined
    }

    else if (target.currentHandCard.state === CardState.DONE_EXECUTE_ANIM) {
      redrawCurrentHandCard(target)
    }
  }

  // Handle keydown events
  for (let key of $.keys) {
    const keyCode = key.keyCode
    if (keyCode in $.down_keys) continue
    if (!key.isDown) continue
    $.down_keys[keyCode] = key

    if ($.player.currentHandCard) {
      if ($.player.currentHandCard.state === CardState.READY) {
        const nextKeyCode = $.player.currentHandCard.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode === keyCode) { // success
          enterDeletingCharState($.player)
        } else { // mistake
          if ($.player.status_effects[StatusEffectType.GLASS_CANNON]) { // destroy card and take damage
            redrawCurrentHandCard($.player)
            $.player.hp = Math.max(0, $.player.hp - 2)
            scene.sound.play("light_attack")
            redrawHealthBar($.player)
          } else { // reset the card
            enterMistakeAnimState($.player)
          }
        }
      }
    } else {
      // no current handCard, try find one
      for (let handCard of $.player.hand) {
        if (handCard.remaining.length === 0) continue
        const nextKeyCode = handCard.remaining[0].toUpperCase().charCodeAt(0)
        if (nextKeyCode !== keyCode) continue
        $.player.currentHandCard = handCard
        if (handCard.remaining.length === 1) {
          executeCardEffect(true, handCard)
        } else {
          handCard.remaining = handCard.remaining.substring(1)
          remakeCardCharObjsBasedOnRemaining(handCard)
          for (let x of handCard.char_objs) x.setTint(0x55ff55)
        }
        break
      }
    }
  }

  // Enemy update
  if ($.enemy.currentHandCard) {
    let dt_fac = 1
    if ($.enemy.status_effects[StatusEffectType.SLOW]) dt_fac *= 0.5

    if ($.enemy.ms_until_next_char > 0) {
      $.enemy.ms_until_next_char -= dt * dt_fac
    } else { // make enemy type a character
      if ($.enemy.currentHandCard.state === CardState.READY) {
        $.enemy.ms_until_next_char = 1000 / $.enemy.characters_per_second
        if ($.enemy.characters_until_next_mistake > 0) { // successful keystroke
          $.enemy.characters_until_next_mistake--
          enterDeletingCharState($.enemy)
        } else { // mistake, reset the word
          recalcEnemyCharactersUntilNextMistake()
          $.enemy.cur_casting_cooldown_ms = $.enemy.casting_cooldown_ms
          enterMistakeAnimState($.enemy)
        }
      }
    }
  } else { // no currentHandCard
    if ($.enemy.cur_casting_cooldown_ms > 0) {
      $.enemy.cur_casting_cooldown_ms -= dt
    } else {
      $.enemy.currentHandCard = Phaser.Math.RND.pick($.enemy.hand)
      for (let x of $.enemy.currentHandCard.char_objs) x.setTint(0x55ff55)
    }
  }

  tickStatusEffects(dt)

  // Check for end of battle
  if ($.player.hp <= 0) {
    endBattle(true)
  } else if ($.enemy.hp <= 0) {
    endBattle(false)
  }
}

function endBattle(lost) {
  $.battle_ended = true
  $.battle_lost = lost
  $.postfight_intro_ms_left = 3000

  scene.add.rectangle(400, 300, 400, 300, 0xe0d728).setOrigin(0.5, 0.5)

  scene.add.bitmapText(400, 300, "monoid", "You " + (lost ? "lost :(" : "won!"))
    .setOrigin(0.5, 0.5)
    .setFontSize(40)
    .setCenterAlign()
}

function enterDeletingCharState(target) {
  target.currentHandCard.state = CardState.DELETING_CHAR
  target.currentHandCard.remaining = target.currentHandCard.remaining.substring(1)
  let head_char_obj = target.currentHandCard.char_objs[0]
  scene.tweens.add({
    targets: head_char_obj,
    alpha: { from: 1, to: 0 },
    duration: !!target.status_effects[StatusEffectType.SLOW] ? 150 : 0
  }).on("complete", function() {
    target.currentHandCard.state = CardState.DONE_DELETING_CHAR
  })
}

function enterMistakeAnimState(target) {
  for (let x of target.currentHandCard.char_objs) x.setTint(0xff5555)
  target.currentHandCard.state = CardState.DOING_MISTAKE_ANIM
  scene.sound.play("mistake", { volume: target === $.player ? 0.5 : 0.1 })
  scene.tweens.add({
    targets: target.currentHandCard.anim_container,
    props: {
      x: {
        from: -5,
        to: 5,
        ease: function (t) {
          return (1 + Math.cos(t*10 + Phaser.Math.RND.integerInRange(0, 100)))/2
        },
      },
      y: {
        from: -2,
        to: 2,
        ease: function (t) {
          return (1 + Math.sin(t*10 + Phaser.Math.RND.integerInRange(0, 100)))/2
        },
      },
    },
    duration: 200,
  }).on("complete", function() {
    target.currentHandCard.state = CardState.DONE_MISTAKE_ANIM
  })
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

          if (target.status_effects[StatusEffectType.SHIELD]) {
            const shield_info = target.status_effects[StatusEffectType.SHIELD]
            shield_info.amount = Math.max(0, shield_info.amount - 1)
          } else {
            target.hp = Math.max(0, target.hp - 1)
          }
          redrawHealthBar(target)
        }
        if (status_effect.remaining_secs <= 0) delete target.status_effects[type]
      }

      else if (t === StatusEffectType.SLOW) {
        status_effect.remaining_secs -= dt/1000
        if (status_effect.remaining_secs <= 0) delete target.status_effects[type]
      }

      else if (t === StatusEffectType.GLASS_CANNON) {
        status_effect.remaining_secs -= dt/1000
        if (status_effect.remaining_secs <= 0) delete target.status_effects[type]
      }

      else if (t === StatusEffectType.LENGTH) {
        status_effect.remaining_secs -= dt/1000
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
      else if (t === StatusEffectType.SLOW) str += name + " " + status_effect.remaining_secs.toFixed(0)
      else if (t === StatusEffectType.GLASS_CANNON) str += name + " " + status_effect.remaining_secs.toFixed(0)
      else if (t === StatusEffectType.LENGTH) {
        str += name
        str += ((status_effect.delta_length > 0) ? "+" : "")
        str += status_effect.delta_length
        str += " " + status_effect.remaining_secs.toFixed(0)
      }
    }

    target.status_effects_text_obj.text = str
  }
}

function recalcEnemyCharactersUntilNextMistake() {
  const n = $.enemy.n_characters_between_mistakes.avg + $.enemy.n_characters_between_mistakes.std * Phaser.Math.RND.normal()
  $.enemy.characters_until_next_mistake = Math.max(Math.round(n), 1)
}

function executeCardEffect(asPlayer, card) {
  card.state = CardState.DOING_EXECUTE_ANIM

  const self = asPlayer ? $.player : $.enemy
  const opponent = asPlayer ? $.enemy : $.player

  // accounting
  let didLeech = false
  let healAmount = 0
  let shieldWasHit = false
  let hpDamageAmount = 0
  let damageMultiplier = 1
  let wasBerserk = !!self.status_effects[StatusEffectType.BERSERK]
  let wasGlassCannon = !!self.status_effects[StatusEffectType.GLASS_CANNON]

  if (wasBerserk) damageMultiplier *= 2
  if (wasGlassCannon) damageMultiplier *= 2

  for (let effect of card.card.effects) {
    const target = effect.target_self ? self : opponent
    const target_opp = effect.target_self ? opponent : self

    if (effect.type === EffectType.DAMAGE) {
      let amount = effect.amount * damageMultiplier

      if (target.status_effects[StatusEffectType.SHIELD]) {
        const shield_info = target.status_effects[StatusEffectType.SHIELD]
        const shield_amount = shield_info.amount
        shield_info.amount = Math.max(0, shield_info.amount - amount)
        amount = Math.max(0, amount - shield_amount)
        shieldWasHit = true
      }

      target.hp = Math.max(0, target.hp - amount)
      redrawHealthBar(target)

      hpDamageAmount += amount
    }

    else if (effect.type === EffectType.HEAL) {
      target.hp = Math.min(target.max_hp, target.hp + effect.amount)
      redrawHealthBar(target)

      healAmount += effect.amount
    }

    else if (effect.type === EffectType.LEECH) {
      let amount = effect.amount * damageMultiplier

      if (target.status_effects[StatusEffectType.SHIELD]) {
        const shield_info = target.status_effects[StatusEffectType.SHIELD]
        const shield_amount = shield_info.amount
        shield_info.amount = Math.max(0, shield_info.amount - amount)
        amount = Math.max(0, amount - shield_amount)
        shieldWasHit = true
      }

      target.hp = Math.min(target.max_hp, target.hp - amount)
      redrawHealthBar(target)
      target_opp.hp = Math.min(target_opp.max_hp, target_opp.hp + effect.amount)
      redrawHealthBar(target_opp)

      didLeech = true
      healAmount += amount
      hpDamageAmount += amount
    }

    else if (effect.type === EffectType.APPLY_STATUS_EFFECT) {
      if (effect.status_effect_type === StatusEffectType.SHIELD) {
        if (!target.status_effects[StatusEffectType.SHIELD]) target.status_effects[StatusEffectType.SHIELD] = { amount: 0 }
        target.status_effects[StatusEffectType.SHIELD].amount += effect.amount
      }

      else if (effect.status_effect_type === StatusEffectType.BERSERK) {
        if (!target.status_effects[StatusEffectType.BERSERK]) target.status_effects[StatusEffectType.BERSERK] = { remaining_secs: 0 }
        target.status_effects[StatusEffectType.BERSERK].remaining_secs += effect.duration_secs
        scene.sound.play("berserk")
      }

      else if (effect.status_effect_type === StatusEffectType.POISON) {
        if (!target.status_effects[StatusEffectType.POISON]) target.status_effects[StatusEffectType.POISON] = {
          remaining_secs: 0,
          ms_between_hits: 1000,
          ms_until_next_hit: 1000,
        }
        target.status_effects[StatusEffectType.POISON].remaining_secs += effect.duration_secs
        scene.sound.play("poison")
      }

      else if (effect.status_effect_type === StatusEffectType.SLOW) {
        if (!target.status_effects[StatusEffectType.SLOW]) target.status_effects[StatusEffectType.SLOW] = { remaining_secs: 0 }
        target.status_effects[StatusEffectType.SLOW].remaining_secs += effect.duration_secs
        scene.sound.play("slow")
      }

      else if (effect.status_effect_type === StatusEffectType.GLASS_CANNON) {
        if (!target.status_effects[StatusEffectType.GLASS_CANNON]) target.status_effects[StatusEffectType.GLASS_CANNON] = { remaining_secs: 0 }
        target.status_effects[StatusEffectType.GLASS_CANNON].remaining_secs += effect.duration_secs
      }

      else if (effect.status_effect_type === StatusEffectType.LENGTH) {
        if (!target.status_effects[StatusEffectType.LENGTH]) target.status_effects[StatusEffectType.LENGTH] = {
          remaining_secs: 0,
          delta_length: 0,
        }
        target.status_effects[StatusEffectType.LENGTH].remaining_secs += effect.duration_secs
        target.status_effects[StatusEffectType.LENGTH].delta_length += effect.delta_length
        for (let card of target.hand) {
          if (card === target.currentHandCard) continue
          rerollCardWords(target, card)
        }
        scene.sound.play("word_length_" + (effect.delta_length > 0 ? "up" : "down"))
      }
    }
  }

  let isFirstTween = true
  for (let icon of card.icons) {
    $.icons_layer.add(icon.img)
    icon.img.x += card.root.x
    icon.img.y += card.root.y
    const target = icon.effect.target_self ? self : opponent
    let tween = scene.tweens.add({
      targets: icon.img,
      props: {
        x: {
          from: icon.img.x,
          to: target.character_sprite.x,
        },
        y: {
          from: icon.img.y,
          to: target.character_sprite.y,
        },
      },
      duration: 200,
    })
    if (isFirstTween) {
      tween.on("complete", function() {
        console.log("Asdf")
        card.state = CardState.DONE_EXECUTE_ANIM
      })
      isFirstTween = false
    }
  }

  if (wasBerserk && hpDamageAmount > 0) {
    let berserkSelfDamageAmount = hpDamageAmount/2

    if (self.status_effects[StatusEffectType.SHIELD]) {
      const shield_info = self.status_effects[StatusEffectType.SHIELD]
      const shield_amount = shield_info.amount
      shield_info.amount = Math.max(0, shield_info.amount - berserkSelfDamageAmount)
      berserkSelfDamageAmount = Math.max(0, berserkSelfDamageAmount - shield_amount)
      shieldWasHit = true
    }

    self.hp = Math.min(self.max_hp, self.hp - berserkSelfDamageAmount)
    redrawHealthBar(self)
  }

  // sfx
  if (didLeech) {
    scene.sound.play("leech")
  }

  if (healAmount > 0) {
    scene.sound.play("heal")
  }

  if (hpDamageAmount > 2) {
    scene.sound.play("heavy_attack")
  } else if (hpDamageAmount > 0) {
    scene.sound.play("light_attack")
  } else if (shieldWasHit) {
    scene.sound.play("shield_hit")
  }

  tickStatusEffects(0)
}

function redrawHealthBar(target) {
  target.health_bar_fg.setScale(target.hp/target.max_hp, 1)
  target.health_text_obj.text = target.hp + "/" + target.max_hp
}

function redrawCurrentHandCard(target) {
  if (!target.currentHandCard) return
  redrawCard(target, target.currentHandCard)
  target.currentHandCard = undefined
}

function redrawCard(target, card) {
  card.destroy()

  const forbidden_initial_characters = calcForbiddenInitialCharacters(target)
  const word_length_avg = calcAvgWordLength(target)

  const newHandCard = mkHandCard({
    forbidden_initial_characters: forbidden_initial_characters,
    card: Phaser.Math.RND.pick(target.deck),
    word_length_avg: word_length_avg,
    word_length_std: $.difficulty.word_length.std,
  })

  for (let i = 0; i < target.hand.length; i++) {
    if (target.hand[i] === card) {
      target.hand[i] = newHandCard
      newHandCard.root.x = target.handX
      newHandCard.root.y = target.handY + i*cardSpacing
      break
    }
  }
}

function calcForbiddenInitialCharacters(target) {
  const forbidden_initial_characters = []
  for (let otherHandCard of target.hand) {
    if (otherHandCard === target.currentHandCard) continue
    forbidden_initial_characters.push(otherHandCard.orig_text[0])
  }
  return forbidden_initial_characters
}

function rerollCardWords(target, card) {
  const forbidden_initial_characters = calcForbiddenInitialCharacters(target)
  const orig_text = generateWords(forbidden_initial_characters, card.card.cost, calcAvgWordLength(target), $.difficulty.word_length.std)
  card.orig_text = orig_text
  card.remaining = orig_text
  remakeCardCharObjsBasedOnRemaining(card)
}

function calcAvgWordLength(target) {
  let word_length_avg = $.difficulty.word_length.avg
  if (target.status_effects[StatusEffectType.LENGTH]) {
    word_length_avg += target.status_effects[StatusEffectType.LENGTH].delta_length
  }
  return word_length_avg
}

function generateWords(forbidden_initial_characters, nwords, word_length_avg, word_length_std) {
  let text
  for (let i = 0; i < 50; i++) {
    text = getRandomWord(word_length_avg, word_length_std)
    let conflict_found = false
    const initial_character = text[0].toUpperCase()
    for (let c of forbidden_initial_characters) {
      if (c.toUpperCase() === initial_character) {
        conflict_found = true
        break
      }
    }
    if (!conflict_found) break
  }

  // add the rest of the words
  for (let i = 0; i < nwords - 1; i++) {
    text += " " + getRandomWord(word_length_avg, word_length_std)
  }

  return text
}

function cleanup() {
  $.music.intro.destroy()
  $.music.loop.destroy()

  for (let key of $.keys) {
    key.destroy()
  }

  const xs = [$.player, $.enemy]
  for (let target of xs) {
    target.status_effects_text_obj.destroy()
    target.name_text_obj.destroy()
    target.health_bar_bg.destroy()
    target.health_bar_fg.destroy()
    target.health_text_obj.destroy()
    target.character_sprite.destroy()
    for (let card of target.hand) card.destroy()
  }
}

export default scene
