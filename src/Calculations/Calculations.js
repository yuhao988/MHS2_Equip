const tempLvl = 50;

//Damage formula for damage to health
export function healthDamage(youMove, opMove,youMon, opMon, youCurHp, opCurHP) {
  let resultYou = Math.max(Math.floor(youMon.Attack/opMon.Defence*youMove.Strength/2+tempLvl/10),1);
  let resultOp = Math.max(Math.floor(opMon.Attack/youMon.Defence*opMove.Strength/2+tempLvl/10),1);
  const youEndHP= Math.max(youCurHp-resultOp,0);
  const opEndHP= Math.max(opCurHP-resultYou,0);
  return [youEndHP, opEndHP];
}

//Damage formula for damage to parts
export function partDamage(youMove, opMove,youMon, opMon, youPartHp, opPartHp, youPart, opPart) {
  const youType = groupAtkType(youMove.Type);
  const opType = groupAtkType(opMove.Type);
  //const [isAdvYou, isAdvOp] = checkAdvantage(youMove, opMove);
  
  
  let resultYou = Math.floor(opMove.Cost+youMon.Break+youMove.Break+tempLvl/15);
  let resultOp = Math.floor(youMove.Cost+opMon.Break+opMove.Break+tempLvl/15);
  let youEndHP, opEndHP
  
  if (youType === youPart) {
    youEndHP = Math.max(youPartHp-resultOp,0);
  } else{
    youEndHP = youPartHp;
  }
  if (opType === opPart) {
    opEndHP = Math.max(opPartHp-resultYou,0);
  } else{
    opEndHP = opPartHp;
  }
  return [youEndHP, opEndHP];
}

//Check for move type matchup
// function checkAdvantage(youMove, opMove) {
//   const youType = groupAtkType(youMove.Type);
//   const opType = groupAtkType(opMove.Type);

//   const advantageMap = {
//     "Head": "Body",
//     "Body": "Legs",
//     "Legs": "Head"
//   };
  
//   const isAdvYou = advantageMap[youType] === opType;
//   const isAdvOp = advantageMap[opType] === youType;
  
//   return [isAdvYou, isAdvOp];
// }

function groupAtkType(atkType){
  let groupedType;
  switch(atkType){
    case "Head":
      groupedType = "Head";
      break;
    case "Fang":
      groupedType = "Head";
      break;
    case "Horn":
      groupedType = "Head";
      break;
    case "Body":
      groupedType = "Body";
      break;
    case "Tail":
      groupedType = "Body";
      break;
    case "Claws":
      groupedType = "Legs";
      break;
    case "Wings":
      groupedType = "Legs";
      break;
    case "Breath":
      groupedType = "Full";
      break;
    default:
      groupedType = "None";
  }
  return groupedType;
}