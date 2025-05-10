import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Moment } from "@/objects/moment/model";
import { CalendarItem } from "@/widgets/calendar/ui/CalendarItem";

type CalendarItemType = {
  marked: true;
  dotColor: string;
  customData: Moment;
};

interface CustomCalendarProps {
  data: Record<string, Moment>;
  counter: number;
}

export const CustomCalendar = ({ data }: CustomCalendarProps) => {
  return (
    <View style={{ width: "100%", height: "auto" }}>
      <Calendar
        dayComponent={({ date, marking, state }) => {
          if (!date) return null;
          const item = data[date.dateString];

          if (item && item.photoUri && item.mood) {
            return (
              <Link href={`/detail?date=${date.dateString}`}>
                <CalendarItem photoUri={item.photoUri} mood={item.mood} />
              </Link>
            );
          } else {
            return (
              <View style={styles.dayContainer}>
                <Text
                  style={{ color: state === "disabled" ? "gray" : "black" }}
                >
                  {date?.day}
                </Text>
              </View>
            );
          }
        }}
      />
    </View>
  );
};

//<View style={{ padding: 20 }}>
// {momentsData
//    .filter((e) => e.date === selectedDate)
//     .map((e, i) => (
//       <View key={i} style={styles.eventBox}>
//         <Text>{e.description}</Text>
//         {/* 상세 영역에도 CalendarItem 활용 */}
//         <CalendarItem photoUri={e.photoUri} mood={e.mood} />
//       </View>
//     ))}
// </View>

const styles = StyleSheet.create({
  dayContainer: {
    backgroundColor: "#f1f3f5",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  // eventBox: {
  //   marginBottom: 10,
  //   backgroundColor: "#eee",
  //   padding: 10,
  //   borderRadius: 6,
  //   flexDirection: "column",
  //   alignItems: "center",
  // },
});
