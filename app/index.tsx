import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { CustomCalendar } from "@/widgets/calendar/ui";
import { format } from "date-fns";
import { router } from "expo-router";

export default function HomeScreen() {
  const currentDate = format(new Date(), "yyyy-MM-dd");

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: 40,
        }}
      >
        <Text style={{ fontSize: 30 }}>Moments</Text>
        <Pressable
          style={{
            borderRadius: 15,
            backgroundColor: "#cccccc",
            width: 100,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            router.push("/create");
          }}
        >
          <Text>오늘 기록하기</Text>
        </Pressable>
      </View>

      <CustomCalendar currentDate={currentDate} />

      <Image
        source={require("@/shared/ui/bg-emojis.png")}
        style={{
          position: "absolute",
          bottom: 0,
          width: 430,
          height: "auto",
          aspectRatio: 430 / 230,
          opacity: 0.8,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    padding: 20,
    paddingTop: 100,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
