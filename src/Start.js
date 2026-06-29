import { Link } from "react-router-dom";
import { useState } from "react";
import BattleSim from "./BattleSim";
import MoveStats from "./MoveStats";
import MonstieInfo from "./Data/Monsties/MonstieDB.json";
import AttackList from "./Data/Moves/AttacksDB.json";
import "./App.css";

function Start() {
  const [isModal, setIsModal] = useState(false);
  const [isStatModal, setIsStatModal] = useState(false);
  const [selAttack, setSelAttack] = useState(null);
  const [yourMon, setYourMon] = useState(null);
  const [oppoMon, setOppoMon] = useState(null);
  const [yourMonAttack, setYourMonAttack] = useState([null, null, null, null]);
  const monstieNames = MonstieInfo.map((monstie) => monstie.Name);

  const openModal = () => {
    setIsModal(true);
  };
  const closeModal = () => {
    setIsModal(false);
  };

  const openStatModal = (attack) => {
    setSelAttack(attack);
    setIsStatModal(true);
  };
  const closeStatModal = () => {
    setIsStatModal(false);
  };

  // Helper function to find monstie object by name
  const findMonstieByName = (name) => {
    return MonstieInfo.find((monstie) => monstie.Name === name);
  };

  // Helper function to check if an attack is valid
  const isAttackValid = (attackName, attackType, currentSlotIndex) => {
    //Check if attack is used before
    const isSameAtk = yourMonAttack.some(
      (attack, index) =>
        index !== currentSlotIndex &&
        attack !== null &&
        attack.Name === attackName,
    );
    //Check if same type has been occupied
    const isUsedType = yourMonAttack.some(
      (attack, index) =>
        index !== currentSlotIndex &&
        attack !== null &&
        attack.Type === attackType,
    );

    return !isSameAtk && !isUsedType;
  };
  const getValidatedAttackNames = (currentSlotIndex) => {
    const currentAttack = yourMonAttack[currentSlotIndex];

    return AttackList.filter((attack) => {
      // If this slot already has this attack, allow it (so it stays selected)
      if (currentAttack !== null && attack.Name === currentAttack.Name) {
        return true;
      }
      // Only include attacks that pass validation
      return isAttackValid(attack.Name, attack.Type, currentSlotIndex);
    }).map((attack) => attack.Name);
  };

  // Helper function to find attack object by name (only returns valid attacks)
  const findAttackByName = (name) => {
    const attack = AttackList.find((attack) => attack.Name === name);

    // If attack exists and is valid for the current slot, return it
    // if (attack && isAttackValid(attack.Name, attack.Type, currentSlotIndex)) {

    // }
    return attack;
  };

  return (
    <div>
      <header className="page-header">
        <h1>Choose a monstie</h1>
      </header>

      <div className="page-body">
        <h2>Monstie Selection</h2>
        <div
          className="selection-container"
          style={{ display: "flex", gap: "40px", justifyContent: "center" }}
        >
          <div
            className="selection-box"
            style={{ border: "2px solid black", padding: "5px " }}
          >
            <label htmlFor="yourMonstie">Your Monstie: </label>
            <select
              id="yourMonstie"
              value={yourMon ? yourMon.Name : ""}
              onChange={(e) => {
                const selectedMonstie = findMonstieByName(e.target.value);
                setYourMon(selectedMonstie);
              }}
            >
              <option value="">Select a monstie...</option>
              {monstieNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p>Selected: {yourMon ? yourMon.Name : "None"}</p>

            <p>Select Attacks:</p>
            {[0, 1, 2, 3].map((slotIndex) => {
              const currentAttack = yourMonAttack[slotIndex];
              const validatedAttackNames = getValidatedAttackNames(slotIndex);

              return (
                <div key={slotIndex} style={{ marginTop: "3px" }}>
                  <label style={{ fontSize: "14px" }}>
                    Slot {slotIndex + 1}:{" "}
                  </label>
                  <select
                    value={currentAttack ? currentAttack.Name : ""}
                    onChange={(e) => {
                      const selectedAttack = e.target.value
                        ? findAttackByName(e.target.value)
                        : null;
                      const newAttacks = [...yourMonAttack];
                      newAttacks[slotIndex] = selectedAttack;
                      setYourMonAttack(newAttacks);
                    }}
                    style={{ width: "95%" }}
                  >
                    <option value="">None</option>
                    {validatedAttackNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  
                </div>
              );
            })}
            <div><p>Selected Attacks:</p>
            <ul>
              {yourMonAttack.filter((a) => a !== null).map((attack, index) => (
                <li key={index}>
                  <button onClick={() => openStatModal(attack)}>{attack.Name}</button>
                </li>
              ))}
            </ul>
            </div>
            
          </div>

          <div
            className="selection-box"
            style={{ border: "2px solid black", padding: "5px " }}
          >
            <label htmlFor="oppoMonstie">Your Opponent's Monstie: </label>
            <select
              id="oppoMonstie"
              value={oppoMon ? oppoMon.Name : ""}
              onChange={(e) => {
                const selectedMonstie = findMonstieByName(e.target.value);
                setOppoMon(selectedMonstie);
              }}
            >
              <option value="">Select a monstie...</option>
              {monstieNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p>Selected: {oppoMon ? oppoMon.Name : "None"}</p>
          </div>
        </div>
        <button onClick={() => openModal()} disabled={!yourMon || !oppoMon}>
          Start Battle
        </button>
        <BattleSim
          isOpen={isModal && yourMon != null && oppoMon != null}
          onClose={closeModal}
          youMon={yourMon}
          youAttacks ={yourMonAttack}
          opMon={oppoMon}
        />
        <MoveStats
          isOpen={isStatModal}
          onClose={closeStatModal}
          attack={selAttack}
        />
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default Start;
