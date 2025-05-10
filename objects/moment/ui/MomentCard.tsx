import { format, parse } from "date-fns";
import { Image, ImageBackground } from "expo-image";
import { Text, View } from "react-native";

import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { Moment, MOODCOLOR } from "../model";

export const MomentCard = ({ data }: { data: Moment }) => {
  return (
    <ImageBackground
      source={{ uri: data.photoUri }}
      style={{ width: "100%", height: "100%", flexDirection: "column-reverse" }}
    >
      {
        <MoodEmoji
          mood={data.mood}
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: 180,
            left: 10,
            width: 145,
            height: 145,
          }}
        />
      }

      <Image
        source={require("@/shared/ui/sound-motion.gif")}
        style={{
          position: "absolute",
          bottom: 100,
          left: 151,
          width: 267,
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
  const [month, day] = format(parsedDate, "MMM d").toUpperCase().split(" ");

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
            height: 170,
            backgroundColor: moodColor,
            borderRadius: 14,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "black",
              textAlign: "center",
              marginBottom: -8,
            }}
          >
            {month}
          </Text>
          <Text
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "black",
              textAlign: "center",
            }}
          >
            {day}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            height: 150,
            backgroundColor: "white",
            borderRadius: 14,
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 30,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "black",
              marginBottom: -2,
            }}
          >
            {data?.music?.title ?? "title"}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, color: "black" }}>
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
          height: 90,
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
          height: 75,
          backgroundColor: "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "black",
          }}
        >
          {data?.description ?? "here's description."}
        </Text>
      </View>
    </View>
  );
};
