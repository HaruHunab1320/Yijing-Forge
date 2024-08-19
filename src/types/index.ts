export type Line = "Yin" | "Yang";

export type Element = "Fire" | "Water" | "Earth" | "Wood" | "Metal";

export type Direction =
  | "North"
  | "South"
  | "East"
  | "West"
  | "Northeast"
  | "Northwest"
  | "Southeast"
  | "Southwest";

export interface Trigram {
  name: string;
  lines: [Line, Line, Line];
  element: Element;
  direction: Direction;
  characteristic: string; // Optional characteristic, e.g., "Creative", "Receptive"
  symbol: string;
}

export interface HexagramData {
  [key: string]: any;
}

export interface Hexagram {
  id: number;
  name: string;
  lines: [Line, Line, Line, Line, Line, Line];
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  relationships: Relationships;
  data?: HexagramData;
  keyThemes?: string[]; // List of key themes or ideas associated with the hexagram
  interpretation?: string; // A predefined interpretation or meaning for the hexagram
}

export interface Relationships {
  inverse: Hexagram | null;
  opposite: Hexagram | null;
  nuclear: Hexagram | null;
  mutual: Hexagram | null;
  derivative: Hexagram[];
  shadow: Hexagram | null;
  mirror: Hexagram | null;
  rotational: Hexagram | null;
  sequential: { next: Hexagram | null; previous: Hexagram | null };
  complementaryTrigrams: Hexagram[];
  symmetrical: Hexagram[];
}
