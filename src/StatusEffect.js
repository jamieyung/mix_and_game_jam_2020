const StatusEffectType = {
  SHIELD: 0,
  BERSERK: 1
}

function nameFromType(type) {
  const t = Number(type)
  if (t === StatusEffectType.SHIELD) return "Shield"
  if (t === StatusEffectType.BERSERK) return "Berserk"
  return ""
}

export {
  StatusEffectType,
  nameFromType
}
