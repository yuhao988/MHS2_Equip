//import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import "./App.css";

// Reusable HealthBar component
function HealthBar({ currentHP, maxHP, label }) {
  const hpPercentage = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;
  
  const getHealthBarColor = (percentage) => {
    if (percentage > 60) return "#4CAF50";
    if (percentage > 30) return "#FFA500";
    return "#FF0000";
  };

  return (
    <div style={{ marginTop: "10px", marginBottom: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}: {currentHP} / {maxHP}</span>
        <span>{Math.round(hpPercentage)}%</span>
      </div>
      <div
        style={{
          width: "20vw",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #ccc",
        }}
      >
        <div
          style={{
            width: `${hpPercentage}%`,
            height: "100%",
            backgroundColor: getHealthBarColor(hpPercentage),
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}

function BattleSim(prop) {
  const { isOpen, onClose, youMon, opMon } = prop;

  const [curHPYou, setCurHPYou] = useState(youMon ? youMon.HP : 0);
  const [curHdYou, setCurHdYou] = useState(youMon ? youMon.Head : 0);
  const [curBdyYou, setCurBdyYou] = useState(youMon ? youMon.Body : 0);
  const [curLgsYou, setCurLgsYou] = useState(youMon ? youMon.Legs : 0);
  const [curHPOp, setCurHPOp] = useState(opMon ? opMon.HP : 0);
  const [curHdOp, setCurHdOp] = useState(opMon ? opMon.Head : 0);
  const [curBdyOp, setCurBdyOp] = useState(opMon ? opMon.Body : 0);
  const [curLgsOp, setCurLgsOp] = useState(opMon ? opMon.Legs : 0);

  const handleCloseModal = () => {
    onClose();
  };

  // Helper function to render monster stats
  const renderMonsterStats = (monster, label) => {
    if (!monster) {
      return (
        <div
          className="selection-box"
          style={{
            border: "2px solid black",
            padding: "5px ",
            marginRight: "50px",
            width: "40vw",
          }}
        >
          <label>{label}: None</label>
          <p>No monster selected</p>
        </div>
      );
    }

    return (
      <div
        className="selection-box"
        style={{
          border: "2px solid black",
          padding: "5px ",
          marginRight: "50px",
          width: "40vw",
        }}
      >
        <label>
          {label}: {monster.Name}
        </label>
         <p>HP: {monster.HP}</p>{/*Insert a bar display here} */}
        <p>Head: {monster.Head}</p>
        <p>Body: {monster.Body}</p>
        <p>Legs: {monster.Legs}</p>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel="Battle Simulation"
    >
      <h2>Battle Simulation</h2>

      <div
        className="selection-container"
        style={{ display: "flex", gap: "40px", justifyContent: "center" }}
      >
        <div
          className="selection-box"
          style={{
            border: "2px solid black",
            padding: "5px ",
            marginRight: "50px",
            width: "40vw",
          }}
        >
          {renderMonsterStats(youMon, "You")}
          {renderMonsterStats(opMon, "Opponent")}
        </div>
      </div>
      <button onClick={handleCloseModal} style={{ marginTop: "50px" }}>
        Close
      </button>
    </Modal>
  );
}

export default BattleSim;
