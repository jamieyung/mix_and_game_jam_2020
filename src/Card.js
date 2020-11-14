const EffectType = {
  DAMAGE: 0,
  HEAL: 1,
}

const TargetType = {
  SELF: 0,
  OPPONENT: 1
}

var cards = [
  { id: 0
  , name: "Hit"
  , cost: 1
  , target: TargetType.OPPONENT
  , effect:
    { type: EffectType.DAMAGE
    , amount: 1
    }
  },
  { id: 1
  , name: "Heal"
  , cost: 1
  , target: TargetType.SELF
  , effect:
    { type: EffectType.HEAL
    , amount: 1
    }
  },
  { id: 2
  , name: "Poke"
  , cost: 2
  , target: TargetType.OPPONENT
  , effect:
    { type: EffectType.DAMAGE
    , amount: 1
    }
  },
]

function getCardById(id) {
  for (var c of cards) {
    if (c.id === id) return c
  }
}

export {
  EffectType,
  TargetType,
  getCardById,
}
