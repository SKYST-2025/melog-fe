import { Moment, Mood, Music } from "@/objects/moment/model/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { Image, ImageBackground } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import Toast from "react-native-root-toast";

export default function HomeScreen() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<null | Mood>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [music, setMusic] = useState<null | Music>(null);

  const ratio = 3.3;

  const moodList: Mood[] = ["verygood", "good", "normal", "bad", "verybad"];

  const [image, setImage] = useState<string | null>(null);

  const handleCancel = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    } else {
      router.back(); // step이 0이면 뒤로 가기
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
        // sortBy: [[MediaLibrary.SortBy.creationTime, false]], // 최신 순
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
      -1 // 무한 반복
    );
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
  const date = format(today, "yyyy-MM-dd"); // "2025-05-10"

  const saveMoment = async () => {
    if (!mood || !image || !music) return; // need fallback logic

    const key = date;
    const value: Moment = {
      date: key,
      mood: mood,
      photoUri: image,
      description: description,
      music: music,
    };
    try {
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
      transform: [{ rotate: `${rotation.value}deg` }], // sharedValue에 따라 X축으로 이동하는 스타일
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
              {/*<Button title="갤러리에서 선택" onPress={pickImageFromGallery} />
                            <View style={{ height: 10 }} />
                            <Button title="카메라로 사진 찍기" onPress={takePhotoWithCamera} />*/}
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
              {/* image && <Button title="다음" onPress={() => setStep(prev => prev + 1)} />*/}
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
                          backgroundColor: "transparent", //MOODCOLOR[v],
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
                    borderRadius: 15,
                    width: "90%",
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
              <Text style={{ color: "white" }}>Our Recommendation</Text>
              <Animated.View style={animatedStyle}>
                <Animated.Image
                  source={require("@/shared/ui/disc.png")}
                  style={{ width: 200, height: 200 }}
                />
              </Animated.View>

              <Text style={{ color: "white" }}>Ditto</Text>
              <Text style={{ color: "white" }}>NewJeans</Text>

              <View style={{ height: 30 }} />

              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  width: "90%",
                  alignItems: "center",
                }}
              >
                {[0, 1, 2].map((v, i) => (
                  <View
                    style={{ flexDirection: "row", padding: 10, width: "100%" }}
                    key={i}
                  >
                    <Image
                      source={require("@/shared/ui/disc.png")}
                      style={{ width: 80, height: 80 }}
                    />
                    <View>
                      <Text style={{ color: "white" }}>Ditto</Text>
                      <Text style={{ color: "white" }}>NewJeans</Text>
                    </View>
                  </View>
                ))}

                <Pressable
                  onPress={() => {
                    rotation.value = withSpring(rotation.value + 200);
                  }}
                  style={{
                    margin: 20,
                    borderColor: "#bababa",
                    borderWidth: 1,
                    borderRadius: 100,
                    width: 441 / ratio,
                    height: 108 / ratio,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>more...</Text>
                </Pressable>
              </View>

              <Pressable
                style={{
                  borderRadius: 100,
                  width: 441 / ratio,
                  height: 108 / ratio,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#6F4CFB",
                }}
                onPress={() =>
                  saveMoment().then(
                    () => {
                      Toast.show("기록이 저장되었어요.");
                      router.replace(`/detail?date=${date}`);
                    },
                    () => {
                      alert("error");
                    }
                  )
                }
              >
                <Text style={{ color: "white" }}>choose</Text>
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
    // padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
