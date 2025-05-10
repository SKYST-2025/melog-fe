
/*
import { StyleSheet, Text, View ,ScrollView, TouchableOpacity, Image } from "react-native";

import { CustomCalendar } from "@/widgets";
import { format } from "date-fns";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { groupByWeek } from "@/utils/groupByWeek"; // 이 유틸은 따로 있어야 해

import { Moment } from "@/objects/moment/model";

// TODO: remove mocking data
const mockingData: Moment[] = [
  {
    date: "2025-05-10",
    description: "Project sync",
    mood: "verygood",
    photoUri: "https://picsum.photos/id/1011/100/100",
  },
  {
    date: "2025-05-12",
    description: "Gym session",
    mood: "good",
    photoUri: "https://picsum.photos/id/1012/100/100",
  },
];

export default function HomeScreen() {
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const router = useRouter();

  const grouped = groupByWeek(mockingData);
  const weekKeys = Object.keys(grouped);
  
  return (
    <View style={styles.container}>
      <Text>캘린더 자리</Text>
      <CustomCalendar currentDate={currentDate} momentsData={mockingData} />

      <Link href="/detail">
        <Text>상세화면 보기</Text>
      </Link>

      <Link href="/create">
        <Text>오늘 기록하기</Text>
      </Link>


      <Link href="/Playlist">
        <Text>상세화면 보기</Text>
      </Link>
      <Text style={styles.header}>주간 플레이리스트</Text>
      
      <ScrollView>
        {weekKeys.map((weekKey) => {
          const moments = grouped[weekKey];

          return (
            <TouchableOpacity
              key={weekKey}
              style={styles.weekItem}
              onPress={() =>
                router.push({
                  pathname: "/Playlist",
                  params: { week: weekKey },
                })
              }
            >
              <View style={styles.thumbnailRow}>
                {moments.slice(0, 3).map((moment, index) => (
                  <Image
                    key={index}
                    source={{ uri: moment.photoUri }}
                    style={styles.thumbnail}
                  />
                ))}
              </View>
              <Text style={styles.weekText}>{weekKey.split(" - ").pop()} week</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  subHeader: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  weekItem: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  thumbnailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 6,
  },
  weekText: {
    fontSize: 16,
  },
});
*/

import { Pressable, StyleSheet, Text, View } from "react-native";

//import { CustomCalendar } from "@/widgets/calendar/ui";
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
      {/*<CustomCalendar currentDate={currentDate} />*/}
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