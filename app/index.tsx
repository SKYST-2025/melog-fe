import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model";
import { CustomCalendar } from "@/widgets/calendar/ui";
import { format } from "date-fns";
import { Link, router } from "expo-router";
import { PlaylistSection } from "./PlaylistSection";
import { TopEmotion } from "./TopEmotion";

const getAllMomentsInCurrentMonth = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dateStrings = Array.from({ length: lastDay }, (_, i) =>
    format(new Date(year, month, i + 1), "yyyy-MM-dd")
  );

  const moments = await Promise.all(
    dateStrings.map(async (date) => ({
      date,
      moment: await getMoment(date),
    }))
  );

  return moments;
};

export default function HomeScreen() {
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const [data, setData] = useState<Record<string, Moment>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const momentsArray = await getAllMomentsInCurrentMonth();
      // 배열을 Record<string, Moment>로 변환
      const momentsObj: Record<string, Moment> = {};
      momentsArray.forEach(({ date, moment }) => {
        if (moment) momentsObj[date] = moment;
      });
      setData(momentsObj);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
          paddingBottom: 20,
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

      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 40 }} />
      ) : (
        <CustomCalendar data={data} />
      )}

      <View
        style={{
          alignItems: "center",
          width: 360,
          height: 200,
          margin: 30,
          padding: 20,
          backgroundColor: "white",
          borderRadius: 30,
          zIndex: 10,
          opacity: 0.7,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          이달의 리포트
        </Text>
        <View style={{ flexDirection: "row", gap: 60 }}>
          <Link href={`/History?currentDate=${data.date}`}>
            <TopEmotion data={data} />
          </Link>

          <Link href={`/Playlist?currentDate=${data.date}`}>
            <PlaylistSection data={data} />
          </Link>
        </View>
      </View>

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
