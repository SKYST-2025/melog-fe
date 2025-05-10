import { format, isValid, parseISO } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model";
import { AntDesign } from "@expo/vector-icons";
import { FlatList, Image, TouchableOpacity } from "react-native";

const getAllMomentsInCurrentMonth = async (): Promise<Moment[]> => {
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

  return moments
    .filter((item) => item.moment)
    .map(
      (item) =>
        ({
          ...item.moment,
          date: item.date,
        } as Moment)
    );
};

const getWeekOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = startOfMonth.getDay(); // 0 (일) ~ 6 (토)
  const offsetDate = date.getDate() + dayOfWeek;
  return Math.ceil(offsetDate / 7);
};

const groupByWeek = (currentDate: string, data: Moment[]) => {
  const result: Record<string, Song[]> = {};
  if (!Array.isArray(data))
    return { grouped: result, sortedKeys: [], currentKey: "" };

  data.forEach((moment) => {
    if (!moment.date) return;
    const dateObj = parseISO(moment.date);
    if (!isValid(dateObj)) return;

    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const weekNumber = getWeekOfMonth(dateObj);
    const key = `${month} - Week ${weekNumber}`;

    const song: Song = {
      title: moment.description,
      artist: moment.mood,
      comment: moment.description,
      emoji:
        moment.mood === "verygood"
          ? "😄"
          : moment.mood === "good"
          ? "😊"
          : moment.mood === "normal"
          ? "😐"
          : moment.mood === "bad"
          ? "😟"
          : "😞",
      imageUri: moment.photoUri,
      date: moment.date,
    };

    if (!result[key]) result[key] = [];
    result[key].push(song);
  });

  // currentDate 파싱도 parseISO로!
  const currentDateObj = parseISO(currentDate);
  if (!isValid(currentDateObj)) {
    return { grouped: result, sortedKeys: [], currentKey: "" };
  }
  const currentMonth = currentDateObj.toLocaleString("en-US", {
    month: "long",
  });
  const currentWeekNumber = getWeekOfMonth(currentDateObj);
  const currentKey = `${currentMonth} - Week ${currentWeekNumber}`;

  // 주차 키 정렬: currentKey가 맨 앞, 나머지는 날짜순
  const keys = Object.keys(result);
  const sortedKeys = [
    currentKey,
    ...keys
      .filter((k) => k !== currentKey)
      .sort((a, b) => {
        const [aMonth, aWeek] = a.split(" - Week ");
        const [bMonth, bWeek] = b.split(" - Week ");
        if (aMonth === bMonth) return Number(aWeek) - Number(bWeek);
        return (
          new Date(`${aMonth} 1, 2000`).getMonth() -
          new Date(`${bMonth} 1, 2000`).getMonth()
        );
      }),
  ];

  return { grouped: result, sortedKeys, currentKey };
};

// --- Song 타입 ---
interface Song {
  title: string;
  artist: string;
  comment: string;
  emoji: string;
  imageUri: string;
  date?: string;
}

// --- Playlist 컴포넌트 ---
const Playlist: React.FC<{ data: Moment[]; currentDate: string }> = ({
  data = [],
  currentDate,
}) => {
  const {
    grouped: weeklyPlaylists,
    sortedKeys,
    currentKey,
  } = groupByWeek(currentDate, data);

  const initialIndex = Math.max(sortedKeys.indexOf(currentKey), 0);
  const [weekIndex, setWeekIndex] = useState(initialIndex);

  const currentWeek = sortedKeys[weekIndex];
  const playlist = weeklyPlaylists[currentWeek] || [];

  const changeWeek = (direction: "prev" | "next") => {
    if (direction === "prev" && weekIndex > 0) {
      setWeekIndex(weekIndex - 1);
    } else if (direction === "next" && weekIndex < sortedKeys.length - 1) {
      setWeekIndex(weekIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => changeWeek("prev")}
          disabled={weekIndex === 0}
        >
          <AntDesign
            name="left"
            size={24}
            color={weekIndex === 0 ? "#ccc" : "black"}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.monthText}>{currentWeek?.split(" - ")[0]}</Text>
          <Text style={styles.weekText}>{currentWeek?.split(" - ")[1]}</Text>
        </View>
        <TouchableOpacity
          onPress={() => changeWeek("next")}
          disabled={weekIndex === sortedKeys.length - 1}
        >
          <AntDesign
            name="right"
            size={24}
            color={weekIndex === sortedKeys.length - 1 ? "#ccc" : "black"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlist}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.albumArt} />
            ) : (
              <View style={[styles.albumArt, { backgroundColor: "#ddd" }]} />
            )}
            <View style={styles.songText}>
              <Text style={styles.title}>
                {item.title} - {item.artist}
              </Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            이 주에 기록된 곡이 없습니다.
          </Text>
        }
      />
    </View>
  );
};

// --- PlaylistPage(라우트) ---
export default function PlaylistPage() {
  const { currentDate } = useLocalSearchParams<{ currentDate: string }>();
  const [data, setData] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const momentsArray = await getAllMomentsInCurrentMonth();
      setData(momentsArray);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentDate) {
    return (
      <View style={styles.center}>
        <Text>날짜 정보가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Playlist data={data} currentDate={currentDate as string} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  weekText: {
    fontSize: 18,
    color: "#555",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  songText: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
  },
  comment: {
    color: "#444",
  },
  emoji: {
    fontSize: 24,
  },
});
