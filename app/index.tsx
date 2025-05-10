import { StyleSheet, Text, View } from "react-native";

import { CustomCalendar } from "@/widgets";
import { format } from "date-fns";
import { Link } from "expo-router";

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
});
