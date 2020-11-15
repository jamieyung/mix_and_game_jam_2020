const EffectType = {
  DAMAGE: 0,
  HEAL: 1,
}

const TargetType = {
  SELF: 0,
  OPPONENT: 1
}

const cards = {
  hit: {
    name: "Hit",
    cost: 1,
    target: TargetType.OPPONENT,
    effect: {
      type: EffectType.DAMAGE,
      amount: 1
    }
  },
  heal: {
    name: "Heal",
    cost: 1,
    target: TargetType.SELF,
    effect: {
      type: EffectType.HEAL,
      amount: 1
    }
  },
  poke: {
    name: "Poke",
    cost: 2,
    target: TargetType.OPPONENT,
    effect: {
      type: EffectType.DAMAGE,
      amount: 1
    }
  },
}

export {
  EffectType,
  TargetType,
  cards
}
