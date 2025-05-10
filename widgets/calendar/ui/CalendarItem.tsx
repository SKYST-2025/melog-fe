import { ImageBackground } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

import { Mood, MOODCOLOR } from "@/objects/moment/model";

interface CalendarItemProps {
  photoUri: string;
  mood: Mood;
}

export const CalendarItem = ({ photoUri, mood }: CalendarItemProps) => {
  return (
    <ImageBackground
      source={{ uri: photoUri }}
      style={{
        ...styles.background,
        borderWidth: 7,
        borderColor: MOODCOLOR[mood],
      }}
      resizeMode="cover"
    >
      {/* <View style={styles.overlay}>
        <Image
          source={require("@/shared/ui/emoji.png")}
          style={{ alignSelf: "center", width: 48, height: 48 }}
        />
      </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    overflow: "hidden",
  },
  overlay: {
    opacity: 0.25,
  },
});
