//import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Modal from "react-modal";
//import AttackList from "./Data/Moves/AttacksDB.json";
import {
  healthDamage,
  partDamage,
  checkAdvantage,
  validateMove,
  groupAtkType,
  hitCrit,
} from "./Calculations/Calculations";
import "./App.css";

// Reusable HealthBar component
function HealthBar({ currentHP, maxHP, widthMode }) {
  const hpPercentage = maxHP > 0 ? (currentHP / maxHP) * 100 : 0;

  const getHealthBarColor = (percentage) => {
    if (percentage > 50) return "#4CAF50";
    if (percentage > 25) return "#FFA500";
    return "#FF0000";
  };

  return (
    <div style={{ marginTop: "10px", marginBottom: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {widthMode === 1 ? (
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
  const { isOpen, onClose, youMon, youAttacks, opMon, opAttacks } = prop;

  const [curHPYou, setCurHPYou] = useState(youMon ? youMon.HP : 0);
  const [curHdYou, setCurHdYou] = useState(youMon ? youMon.Head : 0);
  const [curBdyYou, setCurBdyYou] = useState(youMon ? youMon.Body : 0);
  const [curLgsYou, setCurLgsYou] = useState(youMon ? youMon.Legs : 0);
  const [curHPOp, setCurHPOp] = useState(opMon ? opMon.HP : 0);
  const [curHdOp, setCurHdOp] = useState(opMon ? opMon.Head : 0);
  const [curBdyOp, setCurBdyOp] = useState(opMon ? opMon.Body : 0);
  const [curLgsOp, setCurLgsOp] = useState(opMon ? opMon.Legs : 0);
  const [attackUsed, setAttackUsed] = useState(null);
  const [attackUsedOp, setAttackUsedOp] = useState(null);

  // State for battle log
  const [battleLog, setBattleLog] = useState([]);

  // Reset state when modal opens with new monsters
  useEffect(() => {
    if (isOpen) {
      setCurHPYou(youMon ? youMon.HP : 0);
      setCurHdYou(youMon ? youMon.Head : 0);
      setCurBdyYou(youMon ? youMon.Body : 0);
      setCurLgsYou(youMon ? youMon.Legs : 0);
      setCurHPOp(opMon ? opMon.HP : 0);
      setCurHdOp(opMon ? opMon.Head : 0);
      setCurBdyOp(opMon ? opMon.Body : 0);
      setCurLgsOp(opMon ? opMon.Legs : 0);
      setBattleLog([]);
    }
  }, [isOpen, youMon, opMon]); // Re-run when these dependencies change

  const costDurRatio = (attack, durability) => {
    let ratio = 1;
    const type = groupAtkType(attack.Type);
    if (type === "Head") {
      ratio = Math.min(durability[0] / attack.Cost, 1);
    } else if (type === "Body") {
      ratio = Math.min(durability[1] / attack.Cost, 1);
    } else if (type === "Legs") {
      ratio = Math.min(durability[2] / attack.Cost, 1);
    }
    return Math.max(ratio, 0.33);
  };

  const handleCloseModal = () => {
    onClose();
  };

  const handleAttack = () => {
    if (!attackUsed || !attackUsedOp || !youMon || !opMon) {
      return; // Exit if no attack is selected or monsters are not defined
    }

    // Store previous HP values for logging
    const prevHPYou = curHPYou;
    const prevHPOp = curHPOp;
    const prevHdYou = curHdYou;
    const prevHdOp = curHdOp;
    const prevBdyYou = curBdyYou;
    const prevBdyOp = curBdyOp;
    const prevLgsYou = curLgsYou;
    const prevLgsOp = curLgsOp;

    const durabYou = { Head: curHdYou, Body: curBdyYou, Legs: curLgsYou };
    const durabOp = { Head: curHdOp, Body: curBdyOp, Legs: curLgsOp };

    const finalAttackYou = validateMove(attackUsed, durabYou);
    const finalAttackOp = validateMove(attackUsedOp, durabOp);
    setAttackUsed(finalAttackYou);
    setAttackUsedOp(finalAttackOp);
    // Check advantage using the final attacks
    const [isAdvYou, isAdvOp] = checkAdvantage(attackUsed, attackUsedOp);
    const ratioYou = costDurRatio(attackUsed, [curHdYou, curBdyYou, curLgsYou]);
    const ratioOp = costDurRatio(attackUsedOp, [curHdOp, curBdyOp, curLgsOp]);
    ///console.log(`You Advantage: ${isAdvYou}, Opponent Advantage: ${isAdvOp}`);
    const [hitYou, critYou] = hitCrit(attackUsed);
    const [hitOp, critOp] = hitCrit(attackUsedOp);

    let [youHPAfter, opHPAfter] = healthDamage(
      attackUsed,
      attackUsedOp,
      youMon,
      opMon,
      curHPYou,
      curHPOp,
      durabYou,
      durabOp,
      ratioYou,
      ratioOp,
      [hitYou, critYou],
      [hitOp, critOp],
    );
    setCurHPYou(youHPAfter);
    setCurHPOp(opHPAfter);
    let [youHdAfter, opHdAfter] = partDamage(
      attackUsed,
      attackUsedOp,
      youMon,
      opMon,
      curHdYou,
      curHdOp,
      durabYou,
      durabOp,
      "Head",
      "Head",
      ratioYou,
      ratioOp,
      [hitYou, critYou],
      [hitOp, critOp],
    );
    let [youBdyAfter, opBdyAfter] = partDamage(
      attackUsed,
      attackUsedOp,
      youMon,
      opMon,
      curBdyYou,
      curBdyOp,
      durabYou,
      durabOp,
      "Body",
      "Body",
      ratioYou,
      ratioOp,
      [hitYou, critYou],
      [hitOp, critOp],
    );
    let [youLgsAfter, opLgsAfter] = partDamage(
      attackUsed,
      attackUsedOp,
      youMon,
      opMon,
      curLgsYou,
      curLgsOp,
      durabYou,
      durabOp,
      "Legs",
      "Legs",
      ratioYou,
      ratioOp,
      [hitYou, critYou],
      [hitOp, critOp],
    );
    setCurHdYou(youHdAfter);
    setCurHdOp(opHdAfter);
    setCurBdyYou(youBdyAfter);
    setCurBdyOp(opBdyAfter);
    setCurLgsYou(youLgsAfter);
    setCurLgsOp(opLgsAfter);

    // Create battle log entry
    const logEntry = {
      turn: battleLog.length + 1,
      youAttack: attackUsed.Name,
      opAttack: attackUsedOp.Name,
      isAdvYou,
      isAdvOp,
      hpDamageYou: prevHPYou - youHPAfter,
      hpDamageOp: prevHPOp - opHPAfter,
      hdDamageYou: prevHdYou - youHdAfter,
      hdDamageOp: prevHdOp - opHdAfter,
      bdyDamageYou: prevBdyYou - youBdyAfter,
      bdyDamageOp: prevBdyOp - opBdyAfter,
      lgsDamageYou: prevLgsYou - youLgsAfter,
      lgsDamageOp: prevLgsOp - opLgsAfter,
      youHit: hitYou,
      opHit: hitOp,
      youCrit: critYou,
      opCrit: critOp,
    };

    setBattleLog([...battleLog, logEntry]);
  };

  const resetSim = () => {
    setCurHPYou(youMon.HP);
    setCurHdYou(youMon.Head);
    setCurBdyYou(youMon.Body);
    setCurLgsYou(youMon.Legs);
    setCurHPOp(opMon.HP);
    setCurHdOp(opMon.Head);
    setCurBdyOp(opMon.Body);
    setCurLgsOp(opMon.Legs);
    setBattleLog([]);
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
          width: "35vw",
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
        {label === "You" && (
          <select
            id="yourMove"
            value={attackUsed ? attackUsed.Name : ""}
            onChange={(e) => {
              const selectedAttack = youAttacks.find(
                (attack) => attack !== null && attack.Name === e.target.value,
              );
              setAttackUsed(selectedAttack || null);
            }}
            style={{ marginTop: "10px", width: "100%" }}
          >
            <option value="">Select an attack</option>
            {youAttacks.map(
              (attack, index) =>
                attack !== null && (
                  <option key={index} value={attack.Name}>
                    {attack.Name}
                  </option>
                ),
            )}
          </select>
        )}
        {label === "Opponent" && (
          <select
            id="oppoMove"
            value={attackUsedOp ? attackUsedOp.Name : ""}
            onChange={(e) => {
              const selectedAttack = opAttacks.find(
                (attack) => attack !== null && attack.Name === e.target.value,
              );
              setAttackUsedOp(selectedAttack || null);
            }}
            style={{ marginTop: "10px", width: "100%" }}
          >
            <option value="">Select an attack</option>
            {opAttacks.map(
              (attack, index) =>
                attack !== null && (
                  <option key={index} value={attack.Name}>
                    {attack.Name}
                  </option>
                ),
            )}
          </select>
        )}
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
      {/* Battle Log - NEW */}
      <div
        style={{
          marginTop: "20px",
          maxHeight: "150px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <h3>Battle Log</h3>
        {battleLog.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No attacks made yet. Select attacks and press "Attack!"
          </p>
        ) : (
          battleLog.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <strong>Turn {log.turn}:</strong>
              <div style={{ marginTop: "4px" }}>
                <span style={{ fontWeight: "bold" }}>{youMon.Name}</span> used{" "}
                <strong>{log.youAttack}</strong>
                {log.isAdvYou && (
                  <span style={{ color: "green", marginLeft: "5px" }}>
                    ✅ ADVANTAGE!
                  </span>
                )}
                {log.isAdvOp && (
                  <span style={{ color: "red", marginLeft: "5px" }}>
                    ⚠️ DISADVANTAGE
                  </span>
                )}
                {!log.isAdvYou && !log.isAdvOp && (
                  <span style={{ color: "#666", marginLeft: "5px" }}>
                    ↔️ Neutral
                  </span>
                )}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>{opMon.Name}</span> used{" "}
                <strong>{log.opAttack}</strong>
                {log.isAdvOp && (
                  <span style={{ color: "green", marginLeft: "5px" }}>
                    ✅ ADVANTAGE!
                  </span>
                )}
                {log.isAdvYou && (
                  <span style={{ color: "red", marginLeft: "5px" }}>
                    ⚠️ DISADVANTAGE
                  </span>
                )}
                {!log.isAdvYou && !log.isAdvOp && (
                  <span style={{ color: "#666", marginLeft: "5px" }}>
                    ↔️ Neutral
                  </span>
                )}
              </div>
              <div
                style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}
              >
                {!log.youHit && (
                  <span>
                    Your attack missed! <br />
                  </span>
                )}
                {log.youCrit && (
                  <span>
                    Your attack was a critical hit! <br />
                  </span>
                )}
                <span>HP Damage to opponent: {log.hpDamageOp} </span>
                <br />
                <span>
                  Damage to Head: {log.hdDamageOp}
                  <br />
                  Damage to Body:
                  {log.bdyDamageOp} <br />
                  Damage to Legs:
                  {log.lgsDamageOp} <br />
                </span><br/>
                {!log.opHit && <span>Opponent's attack missed!<br/></span>}
                {log.opCrit && (
                  <span>Opponent's attack was a critical hit!<br/></span>
                )}
                <span>HP Damage to you: {log.hpDamageYou} <br/></span>
                <span>
                  Damage to Head: {log.hdDamageYou}
                  <br />
                  Damage to Body:
                  {log.bdyDamageYou} <br />
                  Damage to Legs:
                  {log.lgsDamageYou} <br />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        {" "}
        {/* CHANGED: Added flex container */}
        <button
          onClick={handleAttack}
          style={{ marginTop: "10px" }}
          disabled={curHPYou === 0 || curHPOp === 0}
        >
          {" "}
          {/* CHANGED: marginTop from 50px to 10px */}
          Attack!
        </button>
        <button onClick={resetSim} style={{ marginTop: "10px" }}>
          {" "}
          {/* CHANGED: marginTop from 50px to 10px */}
          Reset
        </button>
        <button onClick={handleCloseModal} style={{ marginTop: "10px" }}>
          {" "}
          {/* CHANGED: marginTop from 50px to 10px */}
          Close
        </button>
      </div>
    </Modal>
  );
}

export default BattleSim;
