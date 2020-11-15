const StatusEffectType = {
  SHIELD: 0,
  BERSERK: 1,
  POISON: 2,
  SLOW: 3,
  GLASS_CANNON: 4,
  LENGTH: 5,
}

function nameFromType(type) {
  const t = Number(type)
  if (t === StatusEffectType.SHIELD) return "Shield"
  if (t === StatusEffectType.BERSERK) return "Berserk"
  if (t === StatusEffectType.POISON) return "Poison"
  if (t === StatusEffectType.SLOW) return "Slow"
  if (t === StatusEffectType.GLASS_CANNON) return "Glass cannon"
  if (t === StatusEffectType.LENGTH) return "Length"
  return ""
}

export {
  StatusEffectType,
  nameFromType
}
