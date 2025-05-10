import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model/moment";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
      {moment && (
        <ImageBackground
          source={{ uri: moment.photoUri }}
          style={{ width: "100%", height: "100%" }}
        >
          <Text>{moment.date}</Text>
          <Text>{moment.description}</Text>
          <Text>{moment.mood}</Text>
          <Text>{moment.photoUri}</Text>
          {/* <Image
            source={{ uri: moment.photoUri }}
            style={{ width: 200, height: 200 }}
          ></Image> */}
        </ImageBackground>
      )}
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
