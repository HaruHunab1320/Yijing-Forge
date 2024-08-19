import { Hexagram, HexagramData, Line, Relationships, Trigram } from "../types";

// Function to find a hexagram by its lines
function findHexagramByLines(
  lines: [Line, Line, Line, Line, Line, Line],
  hexagrams: Hexagram[]
): Hexagram | null {
  return (
    hexagrams.find((h) =>
      h.lines.every((line, index) => line === lines[index])
    ) || null
  );
}

// Function to find a hexagram by its nuclear lines (middle four lines)
function findHexagramByNuclearLines(
  nuclearLines: [Line, Line, Line, Line],
  hexagrams: Hexagram[]
): Hexagram | null {
  return (
    hexagrams.find((h) => {
      const nuclearMatch = [h.lines[1], h.lines[2], h.lines[3], h.lines[4]];
      return nuclearMatch.every((line, index) => line === nuclearLines[index]);
    }) || null
  );
}

// Function to get the next or previous hexagram in a sequence
function getRelatedHexagramBySequence(
  hexagram: Hexagram,
  offset: number,
  hexagrams: Hexagram[]
): Hexagram | null {
  const index = hexagrams.findIndex((h) => h.id === hexagram.id);
  if (index === -1) return null;

  const newIndex = (index + offset + hexagrams.length) % hexagrams.length;
  return hexagrams[newIndex] || null;
}

export function getMirror(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const mirroredLines: [Line, Line, Line, Line, Line, Line] = [
    hexagram.lines[5],
    hexagram.lines[4],
    hexagram.lines[3],
    hexagram.lines[2],
    hexagram.lines[1],
    hexagram.lines[0],
  ];
  return findHexagramByLines(mirroredLines, hexagrams);
}

export function getRotational(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const rotationalLines = [...hexagram.lines].reverse() as [
    Line,
    Line,
    Line,
    Line,
    Line,
    Line
  ];
  return findHexagramByLines(rotationalLines, hexagrams);
}

// Contextual and Situational Relationships

export function getSequentialHexagrams(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): {
  next: Hexagram | null;
  previous: Hexagram | null;
} {
  return {
    next: getRelatedHexagramBySequence(hexagram, 1, hexagrams),
    previous: getRelatedHexagramBySequence(hexagram, -1, hexagrams),
  };
}

// Structural Relationships

export function getComplementaryTrigrams(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram[] {
  return hexagrams.filter(
    (h) =>
      h.upperTrigram.name === hexagram.lowerTrigram.name ||
      h.lowerTrigram.name === hexagram.upperTrigram.name
  );
}

export function getSymmetricalHexagrams(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram[] {
  return hexagrams.filter((h) =>
    h.lines.every((line, i) => line === hexagram.lines[i])
  );
}

// Causal Relationship Example

export function getCausalLinks(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram[] {
  // This is a basic example; real logic should be based on traditional interpretations or rules
  return hexagrams.filter((h) => {
    // Example: A hexagram with more Yin lines may causally lead to a hexagram with more Yang lines
    const yinCount = hexagram.lines.filter((line) => line === "Yin").length;
    const yangCount = h.lines.filter((line) => line === "Yang").length;
    return yangCount > yinCount; // Simple logic: Yang-dominant hexagrams follow Yin-dominant ones
  });
}

export function generateAllHexagrams(hexagramData: HexagramData[]): Hexagram[] {
  const hexagrams: Hexagram[] = [];

  // Populate the hexagrams array using the factory function
  for (const data of hexagramData) {
    const hexagram = createHexagram(
      data.id,
      data.name,
      data.lines,
      hexagrams,
      data
    );
    hexagrams.push(hexagram);
  }

  return hexagrams;
}

function createHexagram(
  id: number,
  name: string,
  lines: [Line, Line, Line, Line, Line, Line],
  hexagrams: Hexagram[],
  data: HexagramData
): Hexagram {
  const upperTrigram: Trigram = {
    name: getTrigramName(lines[0], lines[1], lines[2]),
    lines: [lines[0], lines[1], lines[2]],
  };

  const lowerTrigram: Trigram = {
    name: getTrigramName(lines[3], lines[4], lines[5]),
    lines: [lines[3], lines[4], lines[5]],
  };

  const hexagram: Hexagram = {
    id,
    name,
    lines,
    upperTrigram,
    lowerTrigram,
    relationships: {} as Relationships, // Placeholder to be filled in by the factory
    data: data || {},
  };

  hexagram.relationships = {
    inverse: getInverse(hexagram, hexagrams),
    opposite: getOpposite(hexagram, hexagrams),
    nuclear: getNuclear(hexagram, hexagrams),
    mutual: getMutual(hexagram, hexagrams),
    derivative: getDerivatives(hexagram, hexagrams),
    shadow: getShadow(hexagram, hexagrams),
    mirror: getMirror(hexagram, hexagrams),
    rotational: getRotational(hexagram, hexagrams),
    sequential: getSequentialHexagrams(hexagram, hexagrams),
    complementaryTrigrams: getComplementaryTrigrams(hexagram, hexagrams),
    symmetrical: getSymmetricalHexagrams(hexagram, hexagrams),
  };

  return hexagram;
}

// Additional Utility Functions

export function addDataToHexagram(
  hexagram: Hexagram,
  key: string,
  value: any
): void {
  if (!hexagram.data) {
    hexagram.data = {};
  }
  hexagram.data[key] = value;
}

function getTrigramName(line1: Line, line2: Line, line3: Line): string {
  if (line1 === "Yang" && line2 === "Yang" && line3 === "Yang")
    return "Qian (Heaven)";
  if (line1 === "Yin" && line2 === "Yin" && line3 === "Yin")
    return "Kun (Earth)";
  if (line1 === "Yang" && line2 === "Yin" && line3 === "Yin")
    return "Zhen (Thunder)";
  if (line1 === "Yin" && line2 === "Yang" && line3 === "Yang")
    return "Kan (Water)";
  if (line1 === "Yin" && line2 === "Yin" && line3 === "Yang")
    return "Gen (Mountain)";
  if (line1 === "Yang" && line2 === "Yang" && line3 === "Yin")
    return "Xun (Wind)";
  if (line1 === "Yang" && line2 === "Yin" && line3 === "Yang")
    return "Li (Fire)";
  if (line1 === "Yin" && line2 === "Yang" && line3 === "Yin")
    return "Dui (Lake)";

  return "Unknown";
}

// Now the utility functions (getInverse, getOpposite, etc.) should take the hexagrams parameter.

export function getInverse(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const reversedLines = [...hexagram.lines].reverse() as [
    Line,
    Line,
    Line,
    Line,
    Line,
    Line
  ];
  return findHexagramByLines(reversedLines, hexagrams);
}

export function getOpposite(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const oppositeLines = hexagram.lines.map((line) =>
    line === "Yang" ? "Yin" : "Yang"
  ) as [Line, Line, Line, Line, Line, Line];
  return findHexagramByLines(oppositeLines, hexagrams);
}

export function getNuclear(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const nuclearLines: [Line, Line, Line, Line] = [
    hexagram.lines[1],
    hexagram.lines[2],
    hexagram.lines[3],
    hexagram.lines[4],
  ];
  return findHexagramByNuclearLines(nuclearLines, hexagrams);
}

export function getMutual(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const mutualLines: [Line, Line, Line, Line, Line, Line] = [
    hexagram.lowerTrigram.lines[0],
    hexagram.lowerTrigram.lines[1],
    hexagram.lowerTrigram.lines[2],
    hexagram.upperTrigram.lines[0],
    hexagram.upperTrigram.lines[1],
    hexagram.upperTrigram.lines[2],
  ];
  return findHexagramByLines(mutualLines, hexagrams);
}

export function getDerivatives(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram[] {
  const derivatives: Hexagram[] = [];
  for (let i = 0; i < hexagram.lines.length; i++) {
    const newLines = [...hexagram.lines];
    newLines[i] = newLines[i] === "Yang" ? "Yin" : "Yang";
    const derivative = findHexagramByLines(
      newLines as [Line, Line, Line, Line, Line, Line],
      hexagrams
    );
    if (derivative) {
      derivatives.push(derivative);
    }
  }
  return derivatives;
}

export function getShadow(
  hexagram: Hexagram,
  hexagrams: Hexagram[]
): Hexagram | null {
  const shadowLines: [Line, Line, Line, Line, Line, Line] = hexagram.lines.map(
    (line) => (line === "Yang" ? "Yin" : "Yang")
  ) as [Line, Line, Line, Line, Line, Line];
  return findHexagramByLines(shadowLines, hexagrams);
}
