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
      { type: EffectType.DAMAGE, amount: 5 }
    ]
  },
  heal: {
    name: "Heal",
    cost: 1,
    effects: [
      { type: EffectType.HEAL, amount: 1 }
    ]
  },
  leech: {
    name: "Leech",
    cost: 1,
    effects: [
      { type: EffectType.LEECH, amount: 1 }
    ]
  },
  poke: {
    name: "Poke",
    cost: 1,
    effects: [
      { type: EffectType.DAMAGE, amount: 1 }
    ]
  },
  harden: {
    name: "Harden",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.SHIELD, amount: 5 }
    ]
  },
  berserk: {
    name: "Berserk",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.BERSERK, duration_secs: 10 }
    ]
  },
  poison: {
    name: "Poison",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.POISON, duration_secs: 10 }
    ]
  },
  mud: {
    name: "Mud",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.SLOW, duration_secs: 3 }
    ]
  },
  glass_cannon: {
    name: "Glass cannon",
    cost: 2,
    effects: [
      { type: EffectType.APPLY_STATUS_EFFECT, status_effect_type: SE.GLASS_CANNON, duration_secs: 5 }
    ]
  },
}

export {
  EffectType,
  cards
}
