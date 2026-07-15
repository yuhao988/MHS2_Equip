import AttackList from "../Data/Moves/AttacksDB.json";
const tempLvl = 99;

//Damage formula for damage to health
export function healthDamage(
  youMove,
  opMove,
  youMon,
  opMon,
  youCurHp,
  opCurHP,
  youDurab,
  opDurab,
) {
  const youType = groupAtkType(youMove.Type);
  const opType = groupAtkType(opMove.Type);

  const isStabYou = checkSTAB(youMon, youMove);
  const isStabOp = checkSTAB(opMon, opMove);
  const [isAdvYou, isAdvOp] = checkAdvantage(youMove, opMove);
  let multiYou1 = isStabYou ? 1.2 : 1; //STAB multiplier
  let multiOp1 = isStabOp ? 1.2 : 1;
  let multiYou2 = 1; //Advantage multiplier
  let multiOp2 = 1;

  if (isAdvYou) {
    multiOp2 = 0.5; //Half damage from opponent when you have advantage
    //console.log("You advantage ", youType);
    if (youType === "Head") {
      multiYou2 = 1.2; //Head attacks gets 20% more damage if advantage
      //console.log("You advantage Head");
    } else if (youType === "Legs") {
      multiOp2 = 0; //Legs attacks dodges opponent body attacks
      //console.log("You advantage Legs");
    }
  }
  if (isAdvOp) {
    multiYou2 = 0.5;
    if (opType === "Head") {
      multiOp2 = 1.2;
    } else if (opType === "Legs") {
      multiYou2 = 0;
    }
  }

  let resultYou = Math.floor(
    Math.max(
      (((youMon.Attack / opMon.Defence) * youMove.Strength) / 2 + tempLvl / 5) *
        multiYou1,
      1,
    ) * multiYou2,
  );
  let resultOp = Math.floor(
    Math.max(
      (((opMon.Attack / youMon.Defence) * opMove.Strength) / 2 + tempLvl / 5) *
        multiOp1,
      1,
    ) * multiOp2,
  );

  const threshold1 = isAdvYou ? 1 : 0;
  const threshold2 = isAdvOp ? 1 : 0;
  const youEndHP = Math.max(youCurHp - resultOp, threshold1); //cannot go below 1 if you have advantage
  const opEndHP = Math.max(opCurHP - resultYou, threshold2);
  return [youEndHP, opEndHP];
}

//Damage formula for damage to parts
export function partDamage(
  youMove,
  opMove,
  youMon,
  opMon,
  youPartHp,
  opPartHp,
  youDurab,
  opDurab,
  youPart,
  opPart,
) {
  const youType = groupAtkType(youMove.Type);
  const opType = groupAtkType(opMove.Type);
  const [isAdvYou, isAdvOp] = checkAdvantage(youMove, opMove);
  const isStabYou = checkSTAB(youMon, youMove);
  const isStabOp = checkSTAB(opMon, opMove);

  let resultYou = 0;
  let resultOp = 0;
  let addYou1 = 0;
  let addOp1 = 0;
  let multiYou2 = 1;
  let multiOp2 = 1;
  let youEndHP, opEndHP;

  if (isStabYou) {
    addYou1 += 5;
  }
  if (isStabOp) {
    addOp1 += 5;
  }
  if (isAdvYou) {
    multiOp2 = 0.5;
    if (youType === "Body") {
      addYou1 += 5; //Body attacks gets 5 more break if advantage
    } else if (youType === "Legs") {
      multiOp2 = 0;
    }
  }
  if (isAdvOp) {
    multiYou2 = 0.5;
    if (opType === "Body") {
      addOp1 += 5;
    } else if (opType === "Legs") {
      multiYou2 = 0;
    }
  }

  if (youType === youPart || youType === "Full") {
    resultYou += Math.min(youMove.Cost, youPartHp - 1);
    //console.log(youPart,"1:",Math.min(youMove.Cost, youPartHp - 1));
  }
  if (opType === opPart || opType === "Full") {
    resultOp += Math.min(opMove.Cost, opPartHp - 1);
  }

  if (youType === "Full" || opType === "Full") {
    resultYou += Math.floor(
      ((opMon.Break + opMove.Break + tempLvl / 7 + addOp1) * multiOp2) / 3,
    );
    //console.log(youPart,"2:",Math.floor((opMon.Break + opMove.Break + tempLvl / 15) / 3));
    resultOp += Math.floor(
      ((youMon.Break + youMove.Break + tempLvl / 7 + addYou1) * multiYou2) / 3,
    );
  } else {
    if (youType === youPart) {
      resultYou += Math.floor(
        (opMon.Break + opMove.Break + tempLvl / 7 + addOp1) * multiOp2,
      );
      //console.log(youPart,"3:",Math.floor(opMon.Break + opMove.Break + tempLvl / 15));
    }
    if (opType === opPart) {
      resultOp += Math.floor(
        (youMon.Break + youMove.Break + tempLvl / 7 + addYou1) * multiYou2,
      );
    }
  }
  if (youPartHp === 0) {
    youEndHP = 0;
  } else if (isAdvYou) {
    youEndHP = Math.max(youPartHp - resultYou, 1);
  } else {
    youEndHP = Math.max(youPartHp - resultYou, 0);
  }
  
  if (opPartHp === 0) {
    opEndHP = 0;
  } else if (isAdvOp) {
    opEndHP = Math.max(opPartHp - resultOp, 1);
  } else {
    opEndHP = Math.max(opPartHp - resultOp, 0);
  }

  return [youEndHP, opEndHP];
}

//Check for move type matchup
export function checkAdvantage(youMove, opMove) {
  if (
    youMove.id === 5 ||
    youMove.id === 6 ||
    youMove.id === 7 ||
    opMove.id === 5 ||
    opMove.id === 6 ||
    opMove.id === 7
  ) {
    return [false, false];
  }
  const youType = groupAtkType(youMove.Type);
  const opType = groupAtkType(opMove.Type);

  const advantageMap = {
    Head: "Body",
    Body: "Legs",
    Legs: "Head",
  };

  const isAdvYou = advantageMap[youType] === opType;
  const isAdvOp = advantageMap[opType] === youType;

  return [isAdvYou, isAdvOp];
}

function checkSTAB(monstie, move) {
  const stabMap = {
    Brute: "Head",
    Skillful: "Body",
    Agile: "Legs",
  };
  const type = groupAtkType(move.Type);
  const isStab = stabMap[monstie.Type] === type;
  return isStab;
}

function groupAtkType(atkType) {
  let groupedType;
  switch (atkType) {
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

export function validateMove(move, durability) {
  // Check and replace attacks if corresponding part is broken
  let validatedMove = move;

  const moveType = groupAtkType(move.Type);

  // Check your attacks
  if (moveType === "Head" && durability.Head === 0) {
    validatedMove = AttackList.find((attack) => attack.Name === "Weak Tackle");
  } else if (moveType === "Body" && durability.Body === 0) {
    validatedMove = AttackList.find((attack) => attack.Name === "Weak Slam");
  } else if (moveType === "Legs" && durability.Legs === 0) {
    validatedMove = AttackList.find((attack) => attack.Name === "Weak Strike");
  }

  return validatedMove;
}
