//import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
import "./App.css";

// Reusable HealthBar component
function HealthBar({ currentHP, maxHP, widthMode }) {
  const hpPercentage = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;
  console.log("Cur:" + currentHP);
  console.log("Max:" + maxHP);
  const getHealthBarColor = (percentage) => {
    if (percentage > 60) return "#4CAF50";
    if (percentage > 30) return "#FFA500";
    return "#FF0000";
  };

  return (
    <div style={{ marginTop: "10px", marginBottom: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {widthMode == 1 ? (
          <div
            style={{
              width: "30vw",
              height: "20px",
              backgroundColor: "#e0e0e0",
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid #ccc",
            }}
          >
            {" "}
            <div
              style={{
                width: `${hpPercentage}%`,
                height: "100%",
                backgroundColor: getHealthBarColor(hpPercentage),
                transition: "width 0.3s ease-in-out",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "15vw",
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
        )}
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
  const handleAttack = () => {
    setCurHPYou(Math.max(curHPYou - 5, 0));
    setCurHPOp(Math.max(curHPOp - 5, 0));
  };

  // Helper function to render monster stats
  const renderMonsterStats = (monster, curHP, curHd, curBdy, curLg, label) => {
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
        <label style={{ alignItems: "centre" }}>
          {label}: {monster.Name}
        </label>
        <div>
          HP: {curHP}/{monster.HP}
          <HealthBar currentHP={curHP} maxHP={monster.HP} widthMode={1} />
        </div>

        <div>
          Head:{curHd}/{monster.Head}
          <HealthBar currentHP={curHd} maxHP={monster.Head} widthMode={2} />
        </div>
        <div>
          Body: {curBdy}/{monster.Body}
          <HealthBar currentHP={curBdy} maxHP={monster.Body} widthMode={2} />
        </div>
        <div>
          Legs: {curLg}/{monster.Legs}
          <HealthBar currentHP={curLg} maxHP={monster.Legs} widthMode={2} />
        </div>
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
        {renderMonsterStats(
          youMon,
          curHPYou,
          curHdYou,
          curBdyYou,
          curLgsYou,
          "You",
        )}
        {renderMonsterStats(
          opMon,
          curHPOp,
          curHdOp,
          curBdyOp,
          curLgsOp,
          "Opponent",
        )}
      </div>
      <button onClick={handleAttack} style={{ marginTop: "50px" }}>
        Attack!
      </button>
      <button onClick={handleCloseModal} style={{ marginTop: "50px" }}>
        Close
      </button>
    </Modal>
  );
}

export default BattleSim;
