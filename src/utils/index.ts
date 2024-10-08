import { trigrams } from "../data";
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
  const upperTrigramName = getTrigramName(lines[0], lines[1], lines[2]);
  const lowerTrigramName = getTrigramName(lines[3], lines[4], lines[5]);
  const upperTrigram: Trigram = trigrams[upperTrigramName];
  const lowerTrigram: Trigram = trigrams[lowerTrigramName];

  const hexagram: Hexagram = {
    id,
    name,
    lines,
    upperTrigram,
    lowerTrigram,
    relationships: {} as Relationships, // Placeholder to be filled in below
    data: data || {},
  };

  // Populate the relationships
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

export function getDataFromHexagram(hexagram: Hexagram, key: string): any {
  return hexagram.data?.[key];
}

function getTrigramName(line1: Line, line2: Line, line3: Line): string {
  if (line1 === "Yang" && line2 === "Yang" && line3 === "Yang") return "Qian";
  if (line1 === "Yin" && line2 === "Yin" && line3 === "Yin") return "Kun";
  if (line1 === "Yang" && line2 === "Yin" && line3 === "Yin") return "Zhen";
  if (line1 === "Yin" && line2 === "Yang" && line3 === "Yang") return "Kan";
  if (line1 === "Yin" && line2 === "Yin" && line3 === "Yang") return "Gen";
  if (line1 === "Yang" && line2 === "Yang" && line3 === "Yin") return "Xun";
  if (line1 === "Yang" && line2 === "Yin" && line3 === "Yang") return "Li";
  if (line1 === "Yin" && line2 === "Yang" && line3 === "Yin") return "Dui";

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

// Function to traverse and add data across hexagrams
export function traverseAndAddData(
  hexagram: Hexagram,
  key: string,
  value: any,
  depth: number = 1
): void {
  if (!hexagram || depth <= 0) return;

  // Initialize the data object if it doesn't exist
  if (!hexagram.data) {
    hexagram.data = {};
  }

  // Add data to the current hexagram
  hexagram.data[key] = value;

  // Extract relationships
  const {
    inverse,
    opposite,
    nuclear,
    mutual,
    derivative,
    shadow,
    mirror,
    rotational,
    sequential,
    complementaryTrigrams,
    symmetrical,
  } = hexagram.relationships;

  // Example: Propagate data to inverse, opposite, and nuclear relationships
  if (inverse) traverseAndAddData(inverse, `${key}_inverse`, value, depth - 1);
  if (opposite)
    traverseAndAddData(opposite, `${key}_opposite`, value, depth - 1);
  if (nuclear) traverseAndAddData(nuclear, `${key}_nuclear`, value, depth - 1);
  if (mutual) traverseAndAddData(mutual, `${key}_mutual`, value, depth - 1);
  if (shadow) traverseAndAddData(shadow, `${key}_shadow`, value, depth - 1);
  if (mirror) traverseAndAddData(mirror, `${key}_mirror`, value, depth - 1);
  if (rotational)
    traverseAndAddData(rotational, `${key}_rotational`, value, depth - 1);
  if (sequential.next)
    traverseAndAddData(sequential.next, `${key}_next`, value, depth - 1);
  if (sequential.previous)
    traverseAndAddData(
      sequential.previous,
      `${key}_previous`,
      value,
      depth - 1
    );

  // Propagate data to derivative and complementary trigrams relationships
  derivative.forEach((relatedHexagram) =>
    traverseAndAddData(relatedHexagram, `${key}_derivative`, value, depth - 1)
  );
  complementaryTrigrams.forEach((relatedHexagram) =>
    traverseAndAddData(
      relatedHexagram,
      `${key}_complementary`,
      value,
      depth - 1
    )
  );
  symmetrical.forEach((relatedHexagram) =>
    traverseAndAddData(relatedHexagram, `${key}_symmetrical`, value, depth - 1)
  );
}

export function gatherDataForInterpretation(hexagrams: Hexagram[]): string {
  const hexagramsWithData = hexagrams.filter(
    (h) => h.data && Object.keys(h.data).length > 0
  );

  if (hexagramsWithData.length === 0) {
    return "No hexagrams have data to interpret.";
  }

  let interpretation = "Interpretation of Data-Carrying Hexagrams:\n";

  for (const hexagram of hexagramsWithData) {
    interpretation += `Hexagram ${hexagram.id} (${hexagram.name}):\n`;
    for (const [key, value] of Object.entries(hexagram?.data || {})) {
      interpretation += `  - ${key}: ${value}\n`;
    }
    interpretation += `\n`;
  }

  return interpretation;
}
