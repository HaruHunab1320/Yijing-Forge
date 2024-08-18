import React from "react";
import { HexagramProvider } from "./providers/hexagramProvider";
import HexagramGrid from "./components/HexagramGrid";

function App() {
  return (
    <div className="App">
      <HexagramProvider>
        <HexagramGrid />
      </HexagramProvider>
    </div>
  );
}

export default App;
