import { Link } from "react-router-dom";
import { useState } from "react";
import BattleSim from "./BattleSim";
import MonstieInfo from "./Data/Monsties/MonstieDB.json";
import "./App.css";

function Start() {
  const [isModal, setIsModal] = useState(false);
  const [yourMon, setYourMon] = useState(null);
  const [oppoMon, setOppoMon] = useState(null);
  const monstieNames = MonstieInfo.map((monstie) => monstie.Name);

  const openModal = () => {
    // setYourMonstie(yourMon);
    // setIsUnit(oppoMon);
    setIsModal(true);
  };
  const closeModal = () => {
    setIsModal(false);
  };

  // Helper function to find monstie object by name
  const findMonstieByName = (name) => {
    return MonstieInfo.find(monstie => monstie.Name === name);
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
        <button onClick={() => openModal()} disabled={!yourMon||!oppoMon}>Start Battle</button>
        <BattleSim isOpen={isModal} onClose={closeModal} youMon={yourMon} opMon={oppoMon} />
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default Start;
