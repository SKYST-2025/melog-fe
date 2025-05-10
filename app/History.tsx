import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment, Mood } from "@/objects/moment/model";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

// mood별 리스트
const moodList: { key: Mood }[] = [
  { key: "verygood" },
  { key: "good" },
  { key: "normal" },
  { key: "bad" },
  { key: "verybad" },
];

// 이번 달 모든 moment 가져오기
const getAllMomentsInCurrentMonth = async (): Promise<Moment[]> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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
    .map((item) => ({ ...item.moment, date: item.date } as Moment));
};

// mood별 카운트 통계
const getMoodStats = (moments: Moment[]) => {
  const moodCount: Record<Mood, number> = {
    verygood: 0,
    good: 0,
    normal: 0,
    bad: 0,
    verybad: 0,
  };
  moments.forEach((m) => {
    if (!m.mood) return;
    if (moodCount[m.mood] !== undefined) {
      moodCount[m.mood] += 1;
    }
  });
  return moodCount;
};

export default function MoodStatsPage() {
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

  const moodCount = getMoodStats(data);
  const total = Object.values(moodCount).reduce((sum, v) => sum + v, 0);

  // 항상 5개 mood, 비율(%)로 데이터 구성
  const chartData = moodList.map(({ key }) => {
    const count = moodCount[key] || 0;
    const ratio = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      value: ratio,
      mood: key,
      count,
    };
  });

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이번 달 감정 비율</Text>
      <BarChart
        data={{
          labels: chartData.map(() => ""), // label은 빈 문자열로 (아래 legend에서 MoodEmoji로 표시)
          datasets: [{ data: chartData.map((item) => item.value) }],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        fromZero
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => "purple",
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <View style={styles.legendContainer}>
        {chartData.map((item) => (
          <View key={item.mood} style={styles.legendItem}>
            <MoodEmoji mood={item.mood as Mood} style={styles.legendEmoji} />
            <Text style={styles.legendPercent}>{item.count}번</Text>
          </View>
        ))}
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
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 22,
    marginTop: 50,
    textAlign: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -20,
    marginLeft: 30,
  },
  legendItem: {
    alignItems: "center",
    marginLeft: 25,
  },
  legendEmoji: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  legendLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  legendPercent: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
