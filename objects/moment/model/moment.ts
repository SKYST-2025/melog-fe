export type Moment = {
  date: string;
  mood: Mood;
  photoUri: string;
  description: string;
};

export type Mood = "verygood" | "good" | "normal" | "bad" | "verybad";

export const MOODCOLOR: Record<Mood, string> = {
  verybad: "#FC5959",
  bad: "#3985FF",
  normal: "#6F4CFB",
  good: "#58BB63",
  verygood: "#F9DC00",
} as const;
