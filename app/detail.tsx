import { Moment } from '@/objects/moment/model/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const params = useLocalSearchParams();
  const date = params.date as string;

  const [moment, setMoment] = useState<null | Moment>(null)

  useEffect(() => {
    AsyncStorage.getItem(date).then(v => {
      const moment:Moment = JSON.parse(v || "")
      setMoment(moment)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>{date}</Text>
      {moment && <>
        <Text>{moment.date}</Text>
        <Text>{moment.description}</Text>
        <Text>{moment.mood}</Text>
        <Text>{moment.photoUri}</Text>
        <Image source={{uri: moment.photoUri}} style={{width:200, height:200}}></Image>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

