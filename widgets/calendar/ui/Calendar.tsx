import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Moment } from "@/objects/moment/model";
import { CalendarItem } from "@/widgets/calendar/ui/CalendarItem";

type CalendarItemType = {
  marked: true;
  dotColor: string;
  customData: Moment;
};

interface CustomCalendarProps {
  currentDate: string;
  momentsData: Moment[];
}

export const CustomCalendar = ({
  currentDate,
  momentsData,
}: CustomCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState("");

  const markedDates = momentsData.reduce(
    (acc: Record<string, CalendarItemType>, item: Moment) => {
      acc[item.date] = {
        marked: true,
        dotColor: "blue",
        customData: item,
      };
      return acc;
    },
    {}
  );

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
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: "orange",
          },
        }}
        dayComponent={({ date, marking, state }) => {
          const customMarking = marking as any;
          const item = customMarking?.customData;

          const handlePress = () => {
            date && setSelectedDate(date.dateString);
            //TODO: 사진 열람 화면으로 연결
          };

          if (item && item.photoUri && item.mood) {
            return (
              <Pressable onPress={handlePress}>
                <CalendarItem photoUri={item.photoUri} mood={item.mood} />
              </Pressable>
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
