import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


export default function HomeScreen() {
    const [mood, setMood] = useState<null|number>(null)

    const moodList = [1, 2, 3, 4, 5]

    return (
        <View style={styles.container}>

            <Text style={{fontSize:30}}>
                Mood Select
            </Text>

            <View style={{height:20}} />

            <View style={{flexDirection:'row', width:300, justifyContent:'space-between'}}>
                {moodList.map((v, i) => {
                    return <Pressable
                        key={v}
                        onPress={() => setMood(v)}
                        style={{
                            width:50,
                            height:50,
                            borderRadius:25,
                            borderWidth:1,
                            backgroundColor: v === mood ? 'gray' : 'transparent',
                            borderColor:'black',
                        }}    
                    />
                })}
            </View>
            
            <View style={{height:20}} />

            <View>
            <TextInput placeholder='memo...' style={{borderColor:'black', borderWidth:1, borderRadius:20, width:200}}>

            </TextInput>
            </View>
           

            {mood && <Link href='/create/selectmusic'>
                <Text> 다음 </Text>
            </Link>}
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

