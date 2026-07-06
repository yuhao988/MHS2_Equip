//Damage formula for damage to health
export function healthDamage(youMove, opMove,youMon, opMon, youCurHp, opCurHP) {
  let resultYou = Math.max(Math.floor(youMon.Attack/opMon.Defence*youMove.Strength/2),1);
  let resultOp = Math.max(Math.floor(opMon.Attack/youMon.Defence*opMove.Strength/2),1);
  const youEndHP= Math.max(youCurHp-resultOp,0);
  const opEndHP= Math.max(opCurHP-resultYou,0);
  return [youEndHP, opEndHP];
}

//Damage formula for damage to parts
export function partDamage(youMove, opMove,youMon, opMon, youPartHp, opPartHp) {
  let resultYou = (opMove.Cost+youMon.Break+youMove.Break);
  let resultOp = (youMove.Cost+opMon.Break+opMove.Break);
  const youEndHP= Math.max(youPartHp-resultOp,0);
  const opEndHP= Math.max(opPartHp-resultYou,0);
  return [youEndHP, opEndHP];
}

function checkAdvantage(youMove, opMove) {
  const advantageMap = {
    "Head": "Body",
    "Body": "Claws",
    "Claws": "Head"
  };
  
  const isAdvYou = advantageMap[youMove.Type] === opMove.Type;
  const isAdvOp = advantageMap[opMove.Type] === youMove.Type;
  
  return [isAdvYou, isAdvOp];
}