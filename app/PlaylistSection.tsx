import { Moment } from "@/objects/moment/model";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PlaylistSectionProps {
  data: Record<string, Moment>;
}

export const PlaylistSection: React.FC<PlaylistSectionProps> = ({ data }) => {
  const sortedMoments = Object.entries(data)
    .filter(([_, moment]) => !!moment.photoUri)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 4)
    .map(([date, moment]) => ({ ...moment, date }));
  let collageMoments = sortedMoments;
  if (collageMoments.length > 0 && collageMoments.length < 4) {
    while (collageMoments.length < 4) {
      collageMoments.push(
        collageMoments[collageMoments.length % sortedMoments.length]
      );
    }
  }

  if (sortedMoments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>이번 달 사진 기록이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이달의 사운드 트랙</Text>
      <View style={styles.collageContainer}>
        {sortedMoments.length === 1 && (
          <Image
            source={{ uri: sortedMoments[0].photoUri }}
            style={styles.collage1}
            resizeMode="cover"
          />
        )}
        {sortedMoments.length === 2 && (
          <View style={styles.row}>
            <Image
              source={{ uri: sortedMoments[0].photoUri }}
              style={styles.collage2}
              resizeMode="cover"
            />
            <Image
              source={{ uri: sortedMoments[1].photoUri }}
              style={styles.collage2}
              resizeMode="cover"
            />
          </View>
        )}
        {sortedMoments.length === 3 && (
          <View style={styles.row}>
            <Image
              source={{ uri: sortedMoments[0].photoUri }}
              style={styles.collage3Left}
              resizeMode="cover"
            />
            <View style={styles.col}>
              <Image
                source={{ uri: sortedMoments[1].photoUri }}
                style={styles.collage3Right}
                resizeMode="cover"
              />
              <Image
                source={{ uri: sortedMoments[2].photoUri }}
                style={styles.collage3Right}
                resizeMode="cover"
              />
            </View>
          </View>
        )}
        {sortedMoments.length === 4 && (
          <View style={styles.grid2x2}>
            <Image
              source={{ uri: sortedMoments[0].photoUri }}
              style={styles.collage4}
              resizeMode="cover"
            />
            <Image
              source={{ uri: sortedMoments[1].photoUri }}
              style={styles.collage4}
              resizeMode="cover"
            />
            <Image
              source={{ uri: sortedMoments[2].photoUri }}
              style={styles.collage4}
              resizeMode="cover"
            />
            <Image
              source={{ uri: sortedMoments[3].photoUri }}
              style={styles.collage4}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const COLLAGE_SIZE = 30;

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  collageContainer: {
    width: COLLAGE_SIZE * 2 + 8,
    height: COLLAGE_SIZE * 2 + 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  row: { flexDirection: "row" },
  col: { flexDirection: "column" },
  grid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: COLLAGE_SIZE * 2 + 8,
    height: COLLAGE_SIZE * 2 + 8,
  },
  // 1개: 중앙 크게
  collage1: {
    width: COLLAGE_SIZE * 2 + 8,
    height: COLLAGE_SIZE * 2 + 8,
    borderRadius: 18,
    overflow: "hidden",
  },
  // 2개: 좌우
  collage2: {
    width: COLLAGE_SIZE,
    height: COLLAGE_SIZE * 2 + 8,
    borderRadius: 12,
    marginHorizontal: 2,
    overflow: "hidden",
  },
  // 3개: 왼쪽1, 오른쪽2
  collage3Left: {
    width: COLLAGE_SIZE,
    height: COLLAGE_SIZE * 2 + 8,
    borderRadius: 12,
    marginRight: 2,
    overflow: "hidden",
  },
  collage3Right: {
    width: COLLAGE_SIZE,
    height: COLLAGE_SIZE,
    borderRadius: 12,
    marginBottom: 2,
    overflow: "hidden",
  },
  // 4개: 2x2 그리드
  collage4: {
    width: COLLAGE_SIZE,
    height: COLLAGE_SIZE,
    borderRadius: 12,
    margin: 2,
    overflow: "hidden",
  },
});
