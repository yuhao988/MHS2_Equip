//import { Link } from "react-router-dom";

import React from "react";
import "./App.css";

export function paragraphBreak(text) {
  if (typeof text !== "string") {
    console.warn("Expected string, got:", typeof text);
    return text || "";
  }

  // Split text at <br /> tags and map to JSX elements
  const parts = text.split(/<br\s*\/?>/i);

  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {<br />}
      {part}
      {index < parts.length - 1 && <br />} {/* Add JSX <br> between parts*/}
    </React.Fragment>
  ));
}

function Home() {
  return (
    <div>
      <header className="page-header">
        <h1>Monster Hunter Stories 2 Equipments</h1>
      </header>

      <div className="page-body">
        
        
        <p>
          Testing
        </p>
        
      </div>
    </div>
  );
}

export default Home;
