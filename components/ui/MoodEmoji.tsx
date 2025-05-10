import { Image, ImageStyle } from "expo-image";

import { Mood } from "@/objects/moment/model";
import { StyleProp } from "react-native";

export const MoodEmoji = ({
  mood,
  style,
}: {
  mood: Mood;
  style?: StyleProp<ImageStyle>;
}) => {
  if (mood === "bad") {
    return (
      <Image source={require("@/shared/ui/emotion-bad.png")} style={style} />
    );
  }
  if (mood === "good") {
    return (
      <Image source={require("@/shared/ui/emotion-good.png")} style={style} />
    );
  }
  if (mood === "verygood") {
    return (
      <Image
        source={require("@/shared/ui/emotion-verygood.png")}
        style={style}
      />
    );
  }
  if (mood === "verybad") {
    return (
      <Image
        source={require("@/shared/ui/emotion-verybad.png")}
        style={style}
      />
    );
  }
  if (mood === "normal") {
    return (
      <Image source={require("@/shared/ui/emotion-normal.png")} style={style} />
    );
  }
};
