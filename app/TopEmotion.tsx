import { MoodEmoji } from "@/components/ui/MoodEmoji";
import { Moment, Mood } from "@/objects/moment/model";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function getTopMoods(data: Record<string, Moment>) {
  const moods = Object.values(data)
    .map((m) => m.mood)
    .filter(Boolean);

  const moodCount: Record<string, number> = moods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(moodCount), 0);
  const topMoods = Object.keys(moodCount).filter(
    (mood) => moodCount[mood] === maxCount
  );

  return { topMoods, moodCount, maxCount };
}

interface TopEmotionProps {
  data: Record<string, Moment>;
}

export const TopEmotion: React.FC<TopEmotionProps> = ({ data }) => {
  const { topMoods, moodCount, maxCount } = getTopMoods(data);

  if (Object.keys(moodCount).length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>기록이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>대표 감정</Text>
      <View style={styles.topMoodsRow}>
        {topMoods.map((mood) => (
          <View key={mood} style={styles.moodBox}>
            <MoodEmoji mood={mood as Mood} style={{ width: 50, height: 50 }} />
            <Text style={styles.moodText}>{mood}</Text>
            <Text style={styles.countText}>{moodCount[mood]}회</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 0 },
  subTitle: { fontSize: 14, color: "#888", marginTop: 12 },
  topMoodsRow: { flexDirection: "row", marginTop: 8 },
  moodBox: {
    borderRadius: 12,
    padding: 0,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  moodText: { fontSize: 16, fontWeight: "600" },
  countText: { fontSize: 12, color: "#333" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  statBox: {
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    padding: 6,
    margin: 2,
    alignItems: "center",
  },
});
