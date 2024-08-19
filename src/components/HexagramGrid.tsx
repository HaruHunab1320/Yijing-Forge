import { trigramUnicodeMap } from "../data";
import { useHexagrams } from "../providers/hexagramProvider";
import { Hexagram } from "../types";

interface HexagramGridProps {
  customOrder?: number[][]; // Optional custom order of hexagram IDs as 2D array
}

// Hexagram component to display each hexagram in the grid
const HexagramCell: React.FC<{ hexagram: Hexagram }> = ({ hexagram }) => {
  return (
    <div className="flex flex-col items-center justify-center border border-black p-2 text-center">
      <div>{hexagram.id}</div>
      <div>{hexagram.name}</div>
      <div className="flex flex-col">
        <div>{trigramUnicodeMap[hexagram.upperTrigram.name]}</div>
        <div>{trigramUnicodeMap[hexagram.lowerTrigram.name]}</div>
      </div>
    </div>
  );
};

// Main component to render the grid
const HexagramGrid: React.FC<HexagramGridProps> = ({ customOrder }) => {
  const { hexagrams } = useHexagrams();
  if (!hexagrams) {
    return null;
  }

  const getHexagramById = (id: number): Hexagram | null => {
    return hexagrams.find((h) => h.id === id) || null;
  };

  return (
    <div className="grid grid-cols-8 gap-2 w-full h-full">
      {customOrder?.map((row, rowIndex) =>
        row.map((id, colIndex) => {
          const hexagram = getHexagramById(id);
          return (
            <HexagramCell
              key={`${rowIndex}-${colIndex}`}
              hexagram={hexagram || ({} as Hexagram)}
            />
          );
        })
      )}
    </div>
  );
};

export default HexagramGrid;
