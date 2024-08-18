import { useHexagrams } from "../providers/hexagramProvider";
import { Hexagram } from "../types";

// Hexagram component to display each hexagram in the grid
const HexagramCell: React.FC<{ hexagram: Hexagram }> = ({ hexagram }) => {
  return (
    <div style={cellStyle}>
      <div>{hexagram.id}</div>
      <div>{hexagram.name}</div>
      <div>
        <div>{hexagram.upperTrigram.name}</div>
        <div>{hexagram.lowerTrigram.name}</div>
      </div>
    </div>
  );
};

// Main component to render the grid
const HexagramGrid: React.FC = () => {
  const { hexagrams } = useHexagrams();
  if (!hexagrams) {
    return null;
  }
  const getHexagramByPosition = (row: number, col: number): Hexagram | null => {
    const position = row * 8 + col;
    return hexagrams[position] || null;
  };

  return (
    <div style={gridStyle}>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {Array.from({ length: 8 }).map((_, colIndex) => {
            const hexagram = getHexagramByPosition(rowIndex, colIndex);
            return (
              <HexagramCell
                key={colIndex}
                hexagram={hexagram || ({} as Hexagram)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Styles for the grid and cells
const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(8, 1fr)",
  gap: "10px",
  width: "100%",
  height: "100%",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  width: "100%",
};

const cellStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  padding: "10px",
  textAlign: "center",
  width: "100%",
  height: "100%",
};

export default HexagramGrid;
