import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model/moment";
import { MomentCard } from "@/objects/moment/ui";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const date = params.date as string;

  const [moment, setMoment] = useState<null | Moment>(null);

  useEffect(() => {
    const moment = getMoment(date);
    moment.then(setMoment as () => void);
  }, []);

  return (
    <View style={styles.container}>
      {moment && <MomentCard data={moment} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {},
});
