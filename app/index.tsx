import { Pressable, StyleSheet, Text, View } from "react-native";


import { CustomCalendar } from "@/widgets/calendar/ui";
import { format } from "date-fns";
import { Link, router } from "expo-router";

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
      <Text style={{ width: "100%", fontSize: 30, paddingBottom: 40 }}>
        Moments
      </Text>

      <CustomCalendar currentDate={currentDate} momentsData={mockingData} />

      <Link href="/detail">
        <Text>상세화면 보기</Text>
      </Link>
      
      <Pressable
        style={{borderRadius: 15, backgroundColor: "#cccccc", width:100, height:30, justifyContent:'center', alignItems:'center'}}
        onPress={() => {
          router.push("/create")
        }}  
      >
       <Text>오늘 기록하기</Text>
      </Pressable>
 
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
