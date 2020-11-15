const EffectType = {
  DAMAGE: 0,
  HEAL: 1,
  LEECH: 2
}

const cards = {
  hit: {
    name: "Hit",
    cost: 1,
    effect: {
      type: EffectType.DAMAGE,
      amount: 1
    }
  },
  heal: {
    name: "Heal",
    cost: 1,
    effect: {
      type: EffectType.HEAL,
      amount: 1
    }
  },
  leech: {
    name: "Leech",
    cost: 1,
    effect: {
      type: EffectType.LEECH,
      amount: 1
    }
  },
  poke: {
    name: "Poke",
    cost: 2,
    effect: {
      type: EffectType.DAMAGE,
      amount: 1
    }
  },
}

export {
  EffectType,
  cards
}
