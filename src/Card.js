import { StatusEffectType as SE } from "./StatusEffect.js"

const EffectType = {
  DAMAGE: 0,
  HEAL: 1,
  LEECH: 2,
  APPLY_STATUS_EFFECT: 3,
}

const cards = {
  hit: {
    name: "Hit",
    cost: 2,
    effects: [
      { type: EffectType.DAMAGE, amount: 5, target_self: false }
    ]
  },
  heal: {
    name: "Heal",
    cost: 1,
    effects: [
      { type: EffectType.HEAL, amount: 1, target_self: true }
    ]
  },
  replenish: {
    name: "Replenish",
    cost: 4,
    effects: [
      { type: EffectType.HEAL, amount: 8, target_self: true }
    ]
  },
  leech: {
    name: "Leech",
    cost: 1,
    effects: [
      { type: EffectType.LEECH, amount: 1, target_self: false }
    ]
  },
  lifesteal: {
    name: "Life Steal",
    cost: 3,
    effects: [
      { type: EffectType.LEECH, amount: 2, target_self: false }
    ]
  },
  bite: {
    name: "Bite",
    cost: 1,
    effects: [
      { type: EffectType.DAMAGE, amount: 2, target_self: false }
    ]
  },
  poke: {
    name: "Poke",
    cost: 1,
    effects: [
      { type: EffectType.DAMAGE, amount: 1, target_self: false }
    ]
  },
  ram: {
    name: "Ram",
    cost: 2,
    effects: [
      { type: EffectType.DAMAGE, amount: 2, target_self: false }
    ]
  },
  crunch: {
    name: "Crunch",
    cost: 3,
    effects: [
      { type: EffectType.DAMAGE, amount: 3, target_self: false }
    ]
  },
  harden: {
    name: "Harden",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.SHIELD, amount: 5, target_self: true }
    ]
  },
  berserk: {
    name: "Berserk",
    cost: 3,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.BERSERK, duration_secs: 10, target_self: true }
    ]
  },
  poison: {
    name: "Poison",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.POISON, duration_secs: 5, target_self: false }
    ]
  },
  mud: {
    name: "Mud",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.SLOW, duration_secs: 3, target_self: false }
    ]
  },
  glass_cannon: {
    name: "Glass cannon",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.GLASS_CANNON, duration_secs: 5, target_self: true }
    ]
  },
  verbosify: {
    name: "Verbosify",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.LENGTH, duration_secs: 5, delta_length: 2, target_self: false }
    ]
  },
  succinct: {
    name: "Succinct",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.LENGTH, duration_secs: 5, delta_length: -2, target_self: true }
    ]
  },
}

export {
  EffectType,
  cards
}
