import { Moment, Mood, MOODCOLOR } from '@/objects/moment/model/moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, FlatList, Image, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import Toast from 'react-native-root-toast';


export default function HomeScreen() {
    const [step, setStep] = useState(0);
    const [mood, setMood] = useState<null | Mood>(null)
    const [description, setDescription] = useState("")
    const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);

    const ratio = 3.3;

    const moodList: Mood[] = ["verygood", "good", "normal", "bad", "verybad"]

    const [image, setImage] = useState<string | null>(null);

    const handleCancel = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        } else {
            router.back(); // step이 0이면 뒤로 가기
        }
        return true
    };

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('사진 접근 권한이 필요합니다.');
                }
            }
        })();

        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
              alert('갤러리 접근 권한이 필요합니다.');
              return;
            }
      
            const media = await MediaLibrary.getAssetsAsync({
              mediaType: 'photo',
              first: 20,
              // sortBy: [[MediaLibrary.SortBy.creationTime, false]], // 최신 순
            });
      
            setPhotos(media.assets);
          })();

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleCancel);

        return () => backHandler.remove();

    }, [step]);

    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhotoWithCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('카메라 권한이 필요합니다.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setStep(prev => prev+1)
        }
    };
    const today = new Date();
    const date = format(today, "yyyy-MM-dd"); // "2025-05-10"

    const saveMoment = async () => {
        if (!mood || !image) return; // need fallback logic

        const key = date;
        const value: Moment = {
            date: key,
            mood: mood,
            photoUri: image,
            description: description
        }
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('저장 실패:', e);
        }
    }

    const scales = [
        useSharedValue(50),
        useSharedValue(50),
        useSharedValue(50),
        useSharedValue(50),
        useSharedValue(50),
    ]

    return (
        <View style={styles.container}>
            <ImageBackground source={image && step > 0 ? { uri: image } : undefined} resizeMode='cover' style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: step > 0 ? 'rgba(0, 0, 0, 0.5)' : undefined, justifyContent: 'center', alignItems: 'center' }}>
                    {step === 0 &&
                        <>
                            {/*<Button title="갤러리에서 선택" onPress={pickImageFromGallery} />
                            <View style={{ height: 10 }} />
                            <Button title="카메라로 사진 찍기" onPress={takePhotoWithCamera} />*/}
                            <Text style={{fontSize: 22, margin: 20}}>Gallery</Text>
                            <FlatList
                                data={[{id:"dummy", uri:"dummy"}, ...photos]}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                renderItem={({ item }) => {
                                    if(item.id === "dummy") {
                                        return <TouchableOpacity onPress={takePhotoWithCamera} style={{ width: 120, height: 120, margin: 2, backgroundColor: '#d9d9d9', alignItems:'center', justifyContent:'center' }}>
                                            <Text style={{fontSize:40}}>
                                                +
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                    return <TouchableOpacity onPress={() => {
                                            setImage(item.uri);
                                            setStep(prev => prev + 1)
                                        }
                                    }>
                                        <Image
                                        source={{ uri: item.uri }}
                                        style={{ width: 120, height: 120, margin: 2 }}
                                        />
                                    </TouchableOpacity>
                                }}
                            />
                            {/* image && <Button title="다음" onPress={() => setStep(prev => prev + 1)} />*/}
                        </>
                    }
                    {
                        step === 1 && <View style={{ flex: 1, width:'100%' }}>
                        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{ fontSize: 30, color: 'white' }}>
                                Mood Select
                            </Text>
                
                            <View style={{ height: 35 }} />
                
                            <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center', height:80 }}>
                                {moodList.map((v, i) => {
                                    
                                    
                                    return <Animated.View key={v} style={{
                                        width:scales[i],
                                        height:scales[i],
                                        borderRadius: 50,
                                        backgroundColor: MOODCOLOR[v],
                                        borderColor: 'black',
                                    }}><Pressable
                                        
                                        onPress={() => {
                                            for(let j=0;j<5;j++) {
                                                if(i === j) scales[j].value = withSpring(70, {duration:1000});
                                                else scales[j].value = withSpring(40, {duration: 1000});
                                            }
                                            
                                            setMood(v);
                                        }}
                                        style={{
                                            flex:1,
                                            width:'100%'
                                        }}
                                    />
                                    </Animated.View>
                                })}
                            </View>
                
                            <View style={{ height: 35 }} />
                
                            <TextInput placeholder='memo...' style={{ borderRadius: 15, width: '90%', backgroundColor: 'rgba(0, 0, 0, 0.4)', color: 'white' }} placeholderTextColor="white" value={description} onChangeText={setDescription} />
                        </View>
                
                        <View style={{alignItems:'center', position:'absolute', bottom:50, width:'100%'}}>
                        <TouchableOpacity onPress={() => setStep(prev => prev + 1)} disabled={mood === null} style={{ width: 670 / ratio, height: 155 / ratio, backgroundColor: "#d9d9d9", borderRadius: 69 / ratio, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 64 / ratio }}>완료</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    }
                    {
                        step === 2 && <>
                            <Text style={{ color: 'white' }}>Our Recommendation</Text>
                            <View style={{ backgroundColor: 'black', width: 150, height: 150, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: 'white', width: 30, height: 30, borderRadius: 25 }} />
                            </View>
                            <Text style={{ color: 'white' }}>Ditto</Text>
                            <Text style={{ color: 'white' }}>NewJeans</Text>
                            <View style={{ borderRadius: 10, backgroundColor: 'rgba(0, 0, 0, 0.5)', width: 300, alignItems: 'center' }}>
                                {[0, 1, 2].map((v, i) => <View style={{ flexDirection: 'row', padding: 10, width: '100%' }} key={i}>
                                    <View style={{ backgroundColor: 'black', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', width: 10, height: 10, borderRadius: 25 }} />
                                    </View>
                                    <View>
                                        <Text style={{ color: 'white' }}>Ditto</Text>
                                        <Text style={{ color: 'white' }}>NewJeans</Text>
                                    </View>
                                </View>)}

                                <Pressable style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10 }}>
                                    <Text style={{ color: "white" }}>more...</Text>
                                </Pressable>
                            </View>

                            <Pressable style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10 }} onPress={
                                () => saveMoment().then(() => {
                                    Toast.show("기록이 저장되었어요.");
                                    router.replace(`/detail?date=${date}`)
                                }, () => { alert("error") })}
                            >
                                <Text style={{ color: "white" }}>choose</Text>
                            </Pressable>
                        </>
                    }
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
        // padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});

