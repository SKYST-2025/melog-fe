import { Moment, Mood, Music } from "@/objects/moment/model/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { Image, ImageBackground } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { readString } from "react-native-csv";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// CSV 데이터
const csvString = `title,singer
Drowning,WOODZ
like JENNIE,제니
너에게 닿기를,10CM
HANDS UP,MEOVV
Whiplash,aespa
poppop,NCT WISH
The Chase,Hearts2Hearts
Maybe Tomorrow,데이식스
toxic till the end,로제
SIGN,이즈나
오늘만 I LOVE YOU,보이넥스트도어
HOT,르세라핌
1-4-3,백예린
사랑의이름으로! (feat. 카리나),잔나비
I DO ME,키키
Flower,오반
1999,마크
TOO BAD (feat. Anderson .Paak),G-DRAGON
Pookie,피프티 피프티
Magnetic,아일릿
마음 따라 뛰는 건 멋지지 않아?,투어스
ATTITUDE,아이브
Gnarly,KATSEYE
가까운 듯 먼 그대여,카더가든
How Sweet,뉴진스
모르시나요,조째즈
1000,NCT WISH
끝났지,데이식스
Supernova,aespa
Messy,로제
Almond Chocolate (Korean Ver.),아일릿
EVERYTHING,검정치마
DRIP,BABYMONSTER
HOME SWEET HOME (feat. TAEYANG & DAESUNG),G-DRAGON
Mantra,제니
HAPPY,데이식스
REBEL HEART,아이브
Skrr (feat. 지젤),김하온
이렇게 좋아해 본 적이 없어요,보이넥스트도어
Armageddon,aespa
Welcome to the Show,데이식스
Antifreeze,백예린
Steady,NCT WISH
Attention,뉴진스
Melt Inside My Pocket,NCT WISH
Jasmine,DPR LIVE
Hype Boy,뉴진스
주저하는 연인들을 위해,잔나비
Not Like Us,Kendrick Lamar
Home Sweet Home,카더가든
Ditto,뉴진스
Bubble Gum,뉴진스
yours,데이먼스 이어
한 페이지가 될 수 있게,데이식스
그대만 있다면 (영화 '여름날 우리'),Nerd Connection
Bye Bye My Blue,백예린
Vancouver,BIG Naughty
사랑으로,wave to earth
Anxiety,도이치
Come Over,르세라핌
Trip (feat. Hannah),릴러말즈
踊り子,Vaundy
Congratulations,데이식스
blue,yung kai
좋은 밤 좋은 꿈,Nerd Connection
Supersonic,fromis_9
한시 오분 (1:05),검정치마
Drama,aespa
Pretender,OFFICIAL HIGE DANDISM
예뻤어,데이식스
Lucky Girl Syndrome,아일릿
Silly Dance,NCT WISH
Here With Me,d4vd
LOVE ATTACK,리센느
Nerdy Love (feat. Yerin Baek),pH-1
TOMBOY,혁오
Supernatural,뉴진스
LAST DANCE,BIGBANG
Spicy,aespa
Sticky,KISS OF LIFE
영원해,도경수
봄여름가을겨울 (Still Life),BIGBANG
청춘만화,이무진
봄 그리고 너,마틴스미스
BIRDS OF A FEATHER,Billie Eilish
UP (KARINA Solo),aespa
OMG,뉴진스
Nice Guy,보이넥스트도어
IF YOU,BIGBANG
Cruel Summer,Taylor Swift
Seeking happy in the crowd,백예린
`;

// 랜덤 추천 함수
const getRandomItems = (arr: any[], n: number) => {
  const result = [];
  const taken = new Set();
  while (result.length < n && arr.length > 0) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!taken.has(idx)) {
      result.push(arr[idx]);
      taken.add(idx);
    }
  }
  return result;
};

const recommendMusic = () => {
  const results = readString(csvString, { header: true });
  const validData = results.data.filter((row: any) => row.title && row.singer);
  return getRandomItems(validData, 3);
};

export default function HomeScreen() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<null | Mood>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [music, setMusic] = useState<null | Music>(null);
  const [recommendedMusic, setRecommendedMusic] = useState<Music[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  useEffect(() => {
    if (step === 2) {
      const recommendations = recommendMusic();
      setRecommendedMusic(recommendations);
      setSelectedMusic(recommendations[0]);
    }
  }, [step]);

  const MusicItem = ({ item }: { item: Music }) => (
    <Pressable
      onPress={() => setSelectedMusic(item)}
      style={({ pressed }) => ({
        flexDirection: "row",
        padding: 15,
        width: "100%",
        backgroundColor:
          selectedMusic?.title === item.title
            ? "rgba(255,255,255,0.15)"
            : "transparent",
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Image
        source={require("@/shared/ui/disc.png")}
        style={{
          width: 50,
          height: 50,
          marginRight: 15,
          borderRadius: 5,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "500",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: "#AAAAAA",
            fontSize: 14,
            marginTop: 4,
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.singer}
        </Text>
      </View>
    </Pressable>
  );

  const ratio = 3.3;
  const moodList: Mood[] = ["verygood", "good", "normal", "bad", "verybad"];
  const [image, setImage] = useState<string | null>(null);

  const handleCancel = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      router.back();
    }
    return true;
  };

  const rotation = useSharedValue(0);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("사진 접근 권한이 필요합니다.");
        }
      }
    })();

    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("갤러리 접근 권한이 필요합니다.");
        return;
      }
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: "photo",
        first: 20,
      });
      setPhotos(media.assets);
    })();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleCancel
    );
    rotation.value = withRepeat(
      withTiming(rotation.value - 360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1
    );
    return () => backHandler.remove();
  }, [step]);

  useFocusEffect(useCallback(() => {}, []));
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
    if (status !== "granted") {
      alert("카메라 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setStep((prev) => prev + 1);
    }
  };

  const today = new Date();
  const date = format(today, "yyyy-MM-dd");

  const saveMoment = async () => {
    if (!mood || !image || !selectedMusic) return;
    const key = date;
    const value: Moment = {
      date: key,
      mood: mood,
      photoUri: image,
      description: description,
      music: selectedMusic,
    };
    try {
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      
    } catch (e) {
      console.error("저장 실패:", e);
    }
  };

  const scales = [
    useSharedValue(50),
    useSharedValue(50),
    useSharedValue(50),
    useSharedValue(50),
    useSharedValue(50),
  ];

  const assets = [
    require("@/shared/ui/emotion-verygood.png"),
    require("@/shared/ui/emotion-good.png"),
    require("@/shared/ui/emotion-normal.png"),
    require("@/shared/ui/emotion-bad.png"),
    require("@/shared/ui/emotion-verybad.png"),
  ];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image && step > 0 ? { uri: image } : undefined}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: step > 0 ? "rgba(0, 0, 0, 0.5)" : undefined,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {step === 0 && (
            <Animated.View key={step} entering={FadeIn} exiting={FadeOut}>
              <Text style={{ fontSize: 22, margin: 20 }}>Gallery</Text>
              <FlatList
                data={[{ id: "dummy", uri: "dummy" }, ...photos]}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => {
                  if (item.id === "dummy") {
                    return (
                      <TouchableOpacity
                        onPress={takePhotoWithCamera}
                        style={{
                          width: 120,
                          height: 120,
                          margin: 2,
                          backgroundColor: "#d9d9d9",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 40 }}>+</Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setImage(item.uri);
                        setStep((prev) => prev + 1);
                      }}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        style={{ width: 120, height: 120, margin: 2 }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </Animated.View>
          )}
          {step === 1 && (
            <Animated.View
              style={{ flex: 1, width: "100%" }}
              key={step}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 30, color: "white" }}>
                  How are you feeling today?
                </Text>

                <View style={{ height: 35 }} />

                <View
                  style={{
                    flexDirection: "row",
                    width: "80%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 80,
                  }}
                >
                  {moodList.map((v, i) => {
                    return (
                      <Animated.View
                        key={v}
                        style={{
                          width: scales[i],
                          height: scales[i],
                          borderRadius: 50,
                          backgroundColor: "transparent",
                          borderColor: "black",
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            for (let j = 0; j < 5; j++) {
                              if (i === j)
                                scales[j].value = withSpring(70, {
                                  duration: 1000,
                                });
                              else
                                scales[j].value = withSpring(40, {
                                  duration: 1000,
                                });
                            }
                            setMood(v);
                          }}
                          style={{
                            flex: 1,
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Image
                            source={assets[i]}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </View>
                <View style={{ height: 35 }} />

                <TextInput
                  placeholder="Write a note..."
                  style={{
                    paddingHorizontal: 20,
                    fontSize: 20,
                    borderRadius: 15,
                    width: "90%",
                    height: 50,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    color: "white",
                  }}
                  placeholderTextColor="white"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View
                style={{
                  alignItems: "center",
                  position: "absolute",
                  bottom: 50,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setStep((prev) => prev + 1);
                  }}
                  disabled={mood === null}
                  style={{
                    width: 670 / ratio,
                    height: 155 / ratio,
                    backgroundColor: "#d9d9d9",
                    borderRadius: 69 / ratio,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 64 / ratio }}>완료</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
          {step === 2 && (
            <Animated.View
              key={step}
              entering={FadeIn}
              exiting={FadeOut}
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 20, marginBottom: 20 }}>
                오늘의 추천 음악
              </Text>

              <Animated.View style={animatedStyle}>
                <Image
                  source={require("@/shared/ui/disc.png")}
                  style={{ width: 200, height: 200 }}
                />
              </Animated.View>

              {selectedMusic && (
                <View style={{ alignItems: "center", marginVertical: 20 }}>
                  <Text style={{ color: "white", fontSize: 18 }}>
                    {selectedMusic.title}
                  </Text>
                  <Text style={{ color: "gray", fontSize: 14 }}>
                    {selectedMusic.singer}
                  </Text>
                </View>
              )}

              {/* 음악 목록 컨테이너 */}
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  width: "90%",
                  maxHeight: "40%",
                  marginVertical: 15,
                }}
              >
                <FlatList
                  data={recommendedMusic}
                  renderItem={({ item }) => <MusicItem item={item} />}
                  keyExtractor={(item) => `${item.title}-${item.singer}`}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                />
              </View>

              {/* 저장 버튼 */}
              <Pressable
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: selectedMusic ? "#6F4CFB" : "#3A3A3A",
                  paddingVertical: 15,
                  paddingHorizontal: 40,
                  borderRadius: 30,
                  marginTop: 20,
                })}
                onPress={() => {
                  if (selectedMusic) {
                    setMusic(selectedMusic);
                    saveMoment().then(() => {
                      router.replace(`/detail?date=${date}`);
                    });
                  }
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {selectedMusic ? "✓ 선택 완료" : "음악을 선택해주세요"}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
