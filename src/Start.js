import { Link } from "react-router-dom";
import React from "react";
import "./App.css";

function Start() {

    return (
    <div>
      <header className="page-header">
        <h1>Choose a monstie</h1>
      </header>

      <div className="page-body">
        
        
        <Link to="/">Back</Link>
        
      </div>
    </div>
  );

}

export default Start;