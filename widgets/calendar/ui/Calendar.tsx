import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model";
import { CalendarItem } from "@/widgets/calendar/ui/CalendarItem";

type CalendarItemType = {
  marked: true;
  dotColor: string;
  customData: Moment;
};

interface CustomCalendarProps {
  currentDate: string;
}

export const CustomCalendar = ({ currentDate }: CustomCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate]);

  return (
    <View style={{ width: "100%", height: "auto" }}>
      <Calendar
        style={{ backgroundColor: undefined }}
        theme={{
          stylesheet: {
            calendar: { main: { style: { backgroundColor: "red" } } },
          },
        }}
        current={selectedDate}
        dayComponent={({ date, marking, state }) => {
          const [item, setMoment] = useState<Moment | null>(null);

          useEffect(() => {
            const momentData = getMoment(date?.dateString as string);
            momentData.then(setMoment as () => void);
          }, [date]);

          if (item && item.photoUri && item.mood) {
            return (
              <Link href={`/detail?date=${date?.dateString}`}>
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
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
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
