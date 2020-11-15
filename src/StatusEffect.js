const StatusEffectType = {
  SHIELD: 0
}

function nameFromType(type) {
  const t = Number(type)
  if (t === StatusEffectType.SHIELD) return "Shield"
  return ""
}

export {
  StatusEffectType,
  nameFromType
}
