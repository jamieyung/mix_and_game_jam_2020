const EffectType = {
  DAMAGE: 0,
  HEAL: 1,
  LEECH: 2,
  SHIELD: 3,
  BERSERK: 4,
  POISON: 5,
  SLOW: 6,
}

const cards = {
  hit: {
    name: "Hit",
    cost: 1,
    effects: [
      { type: EffectType.DAMAGE, amount: 1 }
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
    cost: 2,
    effects: [
      { type: EffectType.DAMAGE, amount: 1 }
    ]
  },
  harden: {
    name: "Harden",
    cost: 2,
    effects: [
      { type: EffectType.SHIELD, amount: 5 }
    ]
  },
  berserk: {
    name: "Berserk",
    cost: 2,
    effects: [
      { type: EffectType.BERSERK, duration_secs: 10 }
    ]
  },
  poison: {
    name: "Poison",
    cost: 2,
    effects: [
      { type: EffectType.POISON, duration_secs: 10 }
    ]
  },
  mud: {
    name: "Mud",
    cost: 2,
    effects: [
      { type: EffectType.SLOW, duration_secs: 3 }
    ]
  },
}

export {
  EffectType,
  cards
}
