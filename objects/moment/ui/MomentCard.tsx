import { format, parse } from "date-fns";
import { Image, ImageBackground } from "expo-image";
import { Text, View } from "react-native";

import { Moment, Mood, MOODCOLOR } from "../model";

const getMoodEmoji = (mood: Mood) => {
  if (mood === "bad") {
    return (
      <Image
        source={require("@/shared/ui/emotion-bad.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 147,
          left: 10,
          width: 145,
          height: 145,
        }}
      />
    );
  }
  if (mood === "good") {
    return (
      <Image
        source={require("@/shared/ui/emotion-good.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 147,
          left: 10,
          width: 145,
          height: 145,
        }}
      />
    );
  }
  if (mood === "verygood") {
    return (
      <Image
        source={require("@/shared/ui/emotion-verygood.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 147,
          left: 10,
          width: 145,
          height: 145,
        }}
      />
    );
  }
  if (mood === "verybad") {
    return (
      <Image
        source={require("@/shared/ui/emotion-verybad.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 147,
          left: 10,
          width: 145,
          height: 145,
        }}
      />
    );
  }
  if (mood === "normal") {
    return (
      <Image
        source={require("@/shared/ui/emotion-normal.png")}
        style={{
          position: "absolute",
          zIndex: 10,
          bottom: 147,
          left: 10,
          width: 145,
          height: 145,
        }}
      />
    );
  }
};

export const MomentCard = ({ data }: { data: Moment }) => {
  return (
    <ImageBackground
      source={{ uri: data.photoUri }}
      style={{ width: "100%", height: "100%", flexDirection: "column-reverse" }}
    >
      {getMoodEmoji(data.mood)}

      <Image
        source={require("@/shared/ui/sound-motion.gif")}
        style={{
          position: "absolute",
          bottom: 80,
          left: 12,
          width: 405,
          height: 100,
        }}
      />
      <DetailInfoSection data={data} />
    </ImageBackground>
  );
};

const DetailInfoSection = ({ data }: { data: Moment }) => {
  const dateString = data.date;
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const formatted = format(parsedDate, "MMM d");

  const moodColor = MOODCOLOR[data.mood];

  return (
    <View
      style={{
        position: "relative",
        width: "auto",
        height: 150,
        marginLeft: 9,
        marginRight: 9,
      }}
    >
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          alignItems: "flex-end",
          left: 0,
          right: 0,
          bottom: 0,
          height: 150,
        }}
      >
        <View
          style={{
            width: 140,
            height: 140,
            backgroundColor: moodColor,
            borderRadius: 14,
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 700, color: "black" }}>
            {formatted}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 135,
            backgroundColor: "white",
            borderRadius: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 5,
            paddingLeft: 40,
            paddingRight: 30,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 600, color: "black" }}>
            {data?.music?.title ?? "title"}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: 400, color: "black" }}>
            {data?.music?.singer ?? "singer"}
          </Text>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          left: 0,
          right: 0,
          bottom: 0,
          height: 100,
          backgroundColor: moodColor,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}
      />
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          left: 0,
          right: 0,
          bottom: 0,
          height: 90,
          backgroundColor: "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 400, color: "black" }}>
          {data?.description ?? "here's description."}
        </Text>
      </View>
    </View>
  );
};
