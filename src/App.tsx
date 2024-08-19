import React from "react";
import "./tailwind.css";
import { HexagramProvider } from "./providers/hexagramProvider";
import HexagramGrid from "./components/HexagramGrid";
import { binaryCrossoverPolarityOrder } from "./data";

function App() {
  return (
    <HexagramProvider>
      <HexagramGrid customOrder={binaryCrossoverPolarityOrder} />
    </HexagramProvider>
  );
}

export default App;
