//import { useState } from "react";
import Modal from "react-modal";
//import AttackList from "./Data/Moves/AttacksDB.json";
import "./App.css";

function MoveStats(props) {
  const { isOpen, onClose, attack } = props;


  const handleCloseModal = () => {
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={{
        width: "50vw",
        height: "50vh",
        content: { width: "50%", margin: "auto" },
      }}
    >
      {attack && (
        <div>
          <h2>{attack.Name}</h2>
          <p>Type: {attack.Type}</p>
          <p>Element: {attack.Element}</p>
          <p>Power: {attack.Strength}</p>
          <p>Break: {attack.Break}</p>
          <p>Accuracy: {attack.Hit}</p>
          <p>Critical: {attack.Crit}</p>
          <p>Cost: {attack.Cost}</p>
          <p>Special Effect: {attack.Effect ? attack.Effect : "None"}</p>
        </div>
      )}
      <button onClick={handleCloseModal} style={{ marginTop: "50px" }}>
        Close
      </button>
    </Modal>
  );
}

export default MoveStats;
