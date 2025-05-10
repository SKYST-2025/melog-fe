import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { Moment } from "@/objects/moment/model";

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
  }, []);

  return (
    <View style={{ width: "100%", height: "auto" }}>
      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: "orange",
          },
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        dayComponent={({ date, marking, state }) => {
          const customMarking = marking as any;
          return (
            <View style={styles.dayContainer}>
              <Text style={{ color: state === "disabled" ? "gray" : "black" }}>
                {date?.day}
              </Text>
              {customMarking?.customData?.photoUri && (
                <Image
                  source={{ uri: customMarking.customData.photoUri }}
                  style={styles.thumbnail}
                />
              )}
            </View>
          );
        }}
      />
      <View style={{ padding: 20 }}>
        {momentsData
          .filter((e) => e.date === selectedDate)
          .map((e, i) => (
            <View key={i} style={styles.eventBox}>
              {/* <Text style={styles.eventTitle}>{e.title}</Text> */}
              <Text>{e.description}</Text>
              <Image
                source={{ uri: e.photoUri }}
                style={styles.detailImage}
                resizeMode="cover"
              />
            </View>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: { alignItems: "center", justifyContent: "center" },
  thumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginTop: 2,
  },
  eventBox: {
    marginBottom: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  eventTitle: { fontWeight: "bold", marginRight: 10 },
  detailImage: { width: 50, height: 50, borderRadius: 6, marginLeft: 10 },
});
