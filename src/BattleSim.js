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
      <p>Battle simulation content goes here...</p>
      <button onClick={handleCloseModal}>Close</button>
    </Modal>
  );
}

export default BattleSim;
