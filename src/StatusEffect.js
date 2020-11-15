const StatusEffectType = {
  SHIELD: 0,
  BERSERK: 1,
  POISON: 2,
  SLOW: 3,
}

function nameFromType(type) {
  const t = Number(type)
  if (t === StatusEffectType.SHIELD) return "Shield"
  if (t === StatusEffectType.BERSERK) return "Berserk"
  if (t === StatusEffectType.POISON) return "Poison"
  if (t === StatusEffectType.SLOW) return "Slow"
  return ""
}

export {
  StatusEffectType,
  nameFromType
}
