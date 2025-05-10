import { getMoment } from "@/objects/moment/api/getMoment";
import { Moment } from "@/objects/moment/model/moment";
import { MomentCard } from "@/objects/moment/ui";
import { Audio } from 'expo-av';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { audios } from "./_layout";

export default function HomeScreen() {
  const params = useLocalSearchParams();
  const date = params.date as string;

  const [moment, setMoment] = useState<null | Moment>(null);

  const playSound = async (m:any) => {
    console.log(m)
    const { sound } = await Audio.Sound.createAsync(
       m // 오디오 파일 경로 (로컬 또는 URL)
    );
    await sound.playAsync(); // 오디오 재생
  };


  useEffect(() => {
    const moment = getMoment(date);
    moment.then(async (v) => {
      const m = v as Moment;
      setMoment(m);

      playSound(audios[m.music.title]);
    });

    
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
