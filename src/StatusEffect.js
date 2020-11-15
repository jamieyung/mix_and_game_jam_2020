const StatusEffectType = {
  SHIELD: 0,
  BERSERK: 1,
  POISON: 2,
}

function nameFromType(type) {
  const t = Number(type)
  if (t === StatusEffectType.SHIELD) return "Shield"
  if (t === StatusEffectType.BERSERK) return "Berserk"
  if (t === StatusEffectType.POISON) return "Poison"
  return ""
}

export {
  StatusEffectType,
  nameFromType
}
