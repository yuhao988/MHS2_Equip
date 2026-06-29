import { Link } from "react-router-dom";
import { useState } from "react";
import BattleSim from "./BattleSim";
import MonstieInfo from "./Data/Monsties/MonstieDB.json";
import AttackList from "./Data/Moves/AttacksDB.json";
import "./App.css";

function Start() {
  const [isModal, setIsModal] = useState(false);
  const [yourMon, setYourMon] = useState(null);
  const [oppoMon, setOppoMon] = useState(null);
  const [yourMonAttack, setYourMonAttack] = useState([null, null, null, null]);
  const monstieNames = MonstieInfo.map((monstie) => monstie.Name);
  const attackNames = AttackList.map((attack) => attack.Name);

  const openModal = () => {
    setIsModal(true);
  };
  const closeModal = () => {
    setIsModal(false);
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

  // Helper function to find attack object by name (only returns valid attacks)
  const findAttackByName = (name, currentSlotIndex) => {
    const attack = AttackList.find((attack) => attack.Name === name);

    // If attack exists and is valid for the current slot, return it
    if (attack && isAttackValid(attack.Name, attack.Type, currentSlotIndex)) {
      return attack;
    }

    // Return null if attack doesn't exist or is invalid
    return null;
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
            <div>
              Attacks:{" "}
              <ul>
                <li>{yourMonAttack[0] ? yourMonAttack[0].Name : "-"}</li>
                <li>{yourMonAttack[1] ? yourMonAttack[1].Name : "-"}</li>
                <li>{yourMonAttack[2] ? yourMonAttack[2].Name : "-"}</li>
                <li>{yourMonAttack[3] ? yourMonAttack[3].Name : "-"}</li>
              </ul>
            </div>
            <select
              id="attack1"
              value={yourMonAttack[0] ? yourMonAttack[0].Name : ""}
              onChange={(e) => {
                const selectedAttack = findAttackByName(e.target.value);
                setYourMonAttack([
                  selectedAttack,
                  yourMonAttack[1],
                  yourMonAttack[2],
                  yourMonAttack[3],
                ]);
              }}
            >
              <option value="">Select an attack...</option>
              {attackNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              id="attack1"
              value={yourMonAttack[1] ? yourMonAttack[1].Name : ""}
              onChange={(e) => {
                const selectedAttack = findAttackByName(e.target.value);
                setYourMonAttack([
                  yourMonAttack[0],
                  selectedAttack,
                  yourMonAttack[2],
                  yourMonAttack[3],
                ]);
              }}
            >
              <option value="">Select an attack...</option>
              {attackNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              id="attack1"
              value={yourMonAttack[2] ? yourMonAttack[2].Name : ""}
              onChange={(e) => {
                const selectedAttack = findAttackByName(e.target.value);
                setYourMonAttack([
                  yourMonAttack[0],
                  yourMonAttack[1],
                  selectedAttack,
                  yourMonAttack[3],
                ]);
              }}
            >
              <option value="">Select an attack...</option>
              {attackNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              id="attack1"
              value={yourMonAttack[3] ? yourMonAttack[3].Name : ""}
              onChange={(e) => {
                const selectedAttack = findAttackByName(e.target.value);
                setYourMonAttack([
                  yourMonAttack[0],
                  yourMonAttack[1],
                  yourMonAttack[2],
                  selectedAttack,
                ]);
              }}
            >
              <option value="">Select an attack...</option>
              {attackNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
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
          opMon={oppoMon}
        />
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default Start;
