//import { Link } from "react-router-dom";
//import { useState } from "react";
import Modal from "react-modal";
import "./App.css";

function BattleSim(prop) {
  const { isOpen, onClose } = prop;
  const handleCloseModal = () => {
    onClose();
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
            style={{ border: "2px solid black", padding: "5px " }}
          >
            <label htmlFor="yourMonstie">You: </label>
            
          </div>

          <div
            className="selection-box"
            style={{ border: "2px solid black", padding: "5px " }}
          >
            <label htmlFor="oppoMonstie">Opponent: </label>
            
          </div>
        </div>
      <button onClick={handleCloseModal}>Close</button>
    </Modal>
  );
}

export default BattleSim;
