export type Moment = {
  date: string;
  mood: Mood;
  photoUri: string;
  description: string;
};

export type Mood = "verygood" | "good" | "normal" | "bad" | "verybad";
