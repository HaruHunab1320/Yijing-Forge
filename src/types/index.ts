export type Line = "Yin" | "Yang";

export interface Trigram {
  name: string;
  lines: [Line, Line, Line];
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
