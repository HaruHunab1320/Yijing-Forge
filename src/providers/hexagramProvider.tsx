import { createContext, useContext, useEffect, useState } from "react";
import { Hexagram } from "../types";
import { hexagramData } from "../data";
import { generateAllHexagrams } from "../utils";

interface HexagramContextType {
  hexagrams: Hexagram[] | null;
}
const HexagramContext = createContext<HexagramContextType | undefined>(
  undefined
);

export const useHexagrams = () => {
  const context = useContext(HexagramContext);
  if (!context) {
    throw new Error("useHexagrams must be used within a HexagramProvider");
  }
  return context;
};

export const HexagramProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hexagrams, setHexagrams] = useState<Hexagram[] | null>(null);

  useEffect(() => {
    const generatedHexagrams = generateAllHexagrams(hexagramData);
    setHexagrams(generatedHexagrams);
  }, []);

  return (
    <HexagramContext.Provider value={{ hexagrams }}>
      {children}
    </HexagramContext.Provider>
  );
};
