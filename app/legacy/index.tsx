import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const [image, setImage] = useState<string | null>(null);

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
  }, []);

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
    }
  };

  return (
    <View style={styles.container}>
      <Button title="갤러리에서 선택" onPress={pickImageFromGallery} />
      <View style={{ height: 10 }} />
      <Button title="카메라로 사진 찍기" onPress={takePhotoWithCamera} />

      {image && (
        <>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
          />
          <Link href="/create/selectmood">
            <Text> 다음 </Text>
          </Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
