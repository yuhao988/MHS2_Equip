import { Link } from "react-router-dom";
import { useState } from "react";
import BattleSim from "./BattleSim";
import MonstieInfo from "./Data/Monsties/MonstieDB.json";
import "./App.css";

function Start() {
  const [isModal, setIsModal] = useState(false);
  const [yourMon, setYourMon] = useState("");
  const [oppoMon, setOppoMon] = useState("");
  const monstieNames = MonstieInfo.map((monstie) => monstie.Name);

  const openModal = () => {
    // setYourMonstie(yourMon);
    // setIsUnit(oppoMon);
    setIsModal(true);
  };
  const closeModal = () => {
    setIsModal(false);
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
              value={yourMon}
              onChange={(e) => setYourMon(e.target.value)}
            >
              <option value="">Select a monstie...</option>
              {monstieNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p>Selected: {yourMon || "None"}</p>
          </div>

          <div
            className="selection-box"
            style={{ border: "2px solid black", padding: "5px " }}
          >
            <label htmlFor="oppoMonstie">Your Opponent's Monstie: </label>
            <select
              id="oppoMonstie"
              value={oppoMon}
              onChange={(e) => setOppoMon(e.target.value)}
            >
              <option value="">Select a monstie...</option>
              {monstieNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <p>Selected: {oppoMon || "None"}</p>
          </div>
        </div>
        <button onClick={() => openModal()}>Start Battle</button>
        <BattleSim isOpen={isModal} onClose={closeModal} />
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default Start;
