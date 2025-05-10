import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, Button, ImageBackground, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
    const [step, setStep] = useState(0);
    const [mood, setMood] = useState<null | number>(null)
    const [description, setDescription] = useState("")

    const moodList = [1, 2, 3, 4, 5]

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
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={image ? { uri: image } : undefined} resizeMode='cover' style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    {step === 0 &&
                        <>
                            <Button title="갤러리에서 선택" onPress={pickImageFromGallery} />
                            <View style={{ height: 10 }} />
                            <Button title="카메라로 사진 찍기" onPress={takePhotoWithCamera} />

                            {image && <Button title="다음" onPress={() => setStep(prev => prev + 1)} />}
                        </>
                    }
                    {
                        step === 1 && <>
                            <Text style={{ fontSize: 30, color: 'white' }}>
                                Mood Select
                            </Text>

                            <View style={{ height: 20 }} />

                            <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between' }}>
                                {moodList.map((v, i) => {
                                    return <Pressable
                                        key={v}
                                        onPress={() => setMood(v)}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            backgroundColor: v === mood ? 'gray' : 'transparent',
                                            borderColor: 'black',
                                        }}
                                    />
                                })}
                            </View>

                            <View style={{ height: 20 }} />

                            <View>
                                <TextInput placeholder='memo...' style={{ borderColor: 'black', borderWidth: 1, borderRadius: 20, width: 200, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }} placeholderTextColor="white" value={description} onChangeText={setDescription}>

                                </TextInput>
                            </View>


                            {mood && <Button title="다음" onPress={() => setStep(prev => prev + 1)} />}
                        </>
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

                            <Pressable style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10 }} onPress={() => router.replace('/detail')}>
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
        // padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});

