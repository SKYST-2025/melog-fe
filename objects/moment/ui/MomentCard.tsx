import { format, parse } from "date-fns";
import { ImageBackground } from "expo-image";
import { Text, View } from "react-native";

import { Moment } from "../model";

export const MomentCard = ({ data }: { data: Moment }) => {
  return (
    <ImageBackground
      source={{ uri: data.photoUri }}
      style={{ width: "100%", height: "100%", flexDirection: "column-reverse" }}
    >
      <DetailInfoSection data={data} />
    </ImageBackground>
  );
};

const DetailInfoSection = ({ data }: { data: Moment }) => {
  const dateString = data.date;
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  const formatted = format(parsedDate, "MMM d");

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
            backgroundColor: "#6F4CFB",
            borderRadius: 14,
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 10,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 700, color: "white" }}>
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
          backgroundColor: "#6F4CFB",
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
          {data?.music?.singer ?? "here's description."}
        </Text>
      </View>
    </View>
  );
};
