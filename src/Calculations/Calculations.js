//Damage formula for damage to health
export function healthDamage(attack, defence) {
  result = Math.max(1, attack - defence);
  return result;
}

//Damage formula for damage to parts
