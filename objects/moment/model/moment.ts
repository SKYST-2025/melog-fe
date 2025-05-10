export type Moment = {
  date: string;
  mood: Mood;
  photoUri: string;
  description: string;
  music: Music;
};

export type Mood = "verygood" | "good" | "normal" | "bad" | "verybad";

export const MOODCOLOR: Record<Mood, string> = {
  verybad: "#FC5959",
  bad: "#3985FF",
  normal: "#A974FF",
  good: "#58BB63",
  verygood: "#F9DC00",
} as const;

export interface Music {
  title: string;
  singer: string;
}
