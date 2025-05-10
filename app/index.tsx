import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
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
import { Link, router, useFocusEffect } from "expo-router";
import { PlaylistSection } from "./PlaylistSection";
import { TopEmotion } from "./TopEmotion";

const setMockMoments = async () => {
  for (const moment of mockMoments) {
    await AsyncStorage.setItem(moment.date, JSON.stringify(moment));
  }
};

export const mockMoments: Moment[] = [
  {
    date: "2025-05-01",
    mood: "good",
    photoUri:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxo2NFiYcR35GzCk5T3nxA7rGlSsXvIfJwg&s",
    description: "햇살 좋은 날 산책을 했어요.",
    music: {
      title: "Drowning",
      singer: "Drowning",
    },
  },
  {
    date: "2025-05-03",
    mood: "good",
    photoUri:
      "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    description: "친구와 맛있는 점심을 먹었어요.",
    music: {
      title: "Lunch Time",
      singer: "Friends",
    },
  },
  {
    date: "2025-05-10",
    mood: "normal",
    photoUri:
      "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350", // Pexels[2]
    description: "평범하게 보낸 하루.",
    music: {
      title: "Ordinary",
      singer: "Daily Life",
    },
  },
  {
    date: "2025-04-15",
    mood: "bad",
    photoUri:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", // Unsplash[1]
    description: "회사에서 실수를 해서 속상했어요.",
    music: {
      title: "Mistake",
      singer: "Work Blues",
    },
  },
  {
    date: "2025-04-22",
    mood: "verybad",
    photoUri:
      "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350", // Pexels[2]
    description: "몸이 아파서 힘든 하루였어요.",
    music: {
      title: "Sick Day",
      singer: "Resting",
    },
  },
  {
    date: "2025-04-24",
    mood: "good",
    photoUri:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // Unsplash[1]
    description: "오랜만에 가족과 저녁을 먹었어요.",
    music: {
      title: "Family Dinner",
      singer: "Home Sweet Home",
    },
  },
  {
    date: "2025-04-28",
    mood: "verygood",
    photoUri:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // Unsplash[1]
    description: "여행을 다녀와서 기분이 최고!",
    music: {
      title: "Travel Vibes",
      singer: "Adventure",
    },
  },
];

const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage가 모두 삭제되었습니다!");
  } catch (e) {
    console.error("스토리지 삭제 중 오류:", e);
  }
};

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
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    (async () => {
      const alreadyInit = await AsyncStorage.getItem("mock_init");
      if (!alreadyInit) {
        await setMockMoments();
        await AsyncStorage.setItem("mock_init", "true");
      }

      setLoading(true);
      const momentsArray = await getAllMomentsInCurrentMonth();
      const momentsObj: Record<string, Moment> = {};
      momentsArray.forEach(({ date, moment }) => {
        if (moment) momentsObj[date] = moment;
      });
      setData(momentsObj);
      setLoading(false);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setCounter((prev) => {
        console.log(prev);
        return prev + 1;
      });
    }, [])
  );
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
  }, [counter]);

  return (
    <View style={styles.container} id={counter.toString()}>
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
        <CustomCalendar data={data} key={counter} counter={counter} />
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
          <Link href={`/History?currentDate=${currentDate}`}>
            <TopEmotion data={data} />
          </Link>

          <Link href={`/Playlist?currentDate=${currentDate}`}>
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
