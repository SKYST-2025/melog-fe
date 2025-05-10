import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { RootSiblingParent } from "react-native-root-siblings";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const audios = {
  "Drowning": require("@/assets/audios/Drowning.mp3"),
  "like JENNIE": require("@/assets/audios/like JENNIE.mp3"),
  // "너에게 닿기를": require("@/assets/audios/너에게 닿기를.mp3"),
  "HANDS UP": require("@/assets/audios/HANDS UP.mp3"),
  "Whiplash": require("@/assets/audios/Whiplash.mp3"),
  "poppop": require("@/assets/audios/poppop.mp3"),
  "The Chase": require("@/assets/audios/The Chase.mp3"),
  "Maybe Tomorrow": require("@/assets/audios/Maybe Tomorrow.mp3"),
  "toxic till the end": require("@/assets/audios/toxic till the end.mp3"),
  "SIGN": require("@/assets/audios/SIGN.mp3"),
  "luther": require("@/assets/audios/luther.mp3"),
  "오늘만 I LOVE YOU": require("@/assets/audios/오늘만 I LOVE YOU.mp3"),
  "HOT": require("@/assets/audios/HOT.mp3"),
  "Die With A Smile": require("@/assets/audios/Die With A Smile.mp3"),
  "1-4-3": require("@/assets/audios/1-4-3.mp3"),
  "사랑의이름으로! (feat. 카리나)": require("@/assets/audios/사랑의이름으로! (feat. 카리나).mp3"),
  "I DO ME": require("@/assets/audios/I DO ME.mp3"),
  "Flower": require("@/assets/audios/Flower.mp3"),
  "1999": require("@/assets/audios/1999.mp3"),
  "TOO BAD (feat. Anderson .Paak)": require("@/assets/audios/TOO BAD (feat. Anderson .Paak).mp3"),
  "Pookie": require("@/assets/audios/Pookie.mp3"),
  "Magnetic": require("@/assets/audios/Magnetic.mp3"),
  // "마음 따라 뛰는 건 멋지지 않아?": require("@/assets/audios/마음 따라 뛰는 건 멋지지 않아?.mp3"),
  "ATTITUDE": require("@/assets/audios/ATTITUDE.mp3"),
  "Gnarly": require("@/assets/audios/Gnarly.mp3"),
  "가까운 듯 먼 그대여": require("@/assets/audios/가까운 듯 먼 그대여.mp3"),
  "How Sweet": require("@/assets/audios/How Sweet.mp3"),
  "모르시나요": require("@/assets/audios/모르시나요.mp3"),
  "1000": require("@/assets/audios/1000.mp3"),
  "끝났지": require("@/assets/audios/끝났지.mp3"),
  "APT.": require("@/assets/audios/APT..mp3"),
  "Supernova": require("@/assets/audios/Supernova.mp3"),
  "Messy": require("@/assets/audios/Messy.mp3"),
  "Almond Chocolate (Korean Ver.)": require("@/assets/audios/Almond Chocolate (Korean Ver.).mp3"),
  "EVERYTHING": require("@/assets/audios/EVERYTHING.mp3"),
  "ExtraL": require("@/assets/audios/ExtraL.mp3"),
  "DRIP": require("@/assets/audios/DRIP.mp3"),
  "HOME SWEET HOME (feat. TAEYANG & DAESUNG)": require("@/assets/audios/HOME SWEET HOME (feat. TAEYANG & DAESUNG).mp3"),
  "Mantra": require("@/assets/audios/Mantra.mp3"),
  "HAPPY": require("@/assets/audios/HAPPY.mp3"),
  "REBEL HEART": require("@/assets/audios/REBEL HEART.mp3"),
  "Skrr (feat. 지젤)": require("@/assets/audios/Skrr (feat. 지젤).mp3"),
  "이렇게 좋아해 본 적이 없어요": require("@/assets/audios/이렇게 좋아해 본 적이 없어요.mp3"),
  "Armageddon": require("@/assets/audios/Armageddon.mp3"),
  "Welcome to the Show": require("@/assets/audios/Welcome to the Show.mp3"),
  "Antifreeze": require("@/assets/audios/Antifreeze.mp3"),
  "Steady": require("@/assets/audios/Steady.mp3"),
  "Attention": require("@/assets/audios/Attention.mp3"),
  "Melt Inside My Pocket": require("@/assets/audios/Melt Inside My Pocket.mp3"),
  "Jasmine": require("@/assets/audios/Jasmine.mp3"),
  "Hype Boy": require("@/assets/audios/Hype Boy.mp3"),
  "주저하는 연인들을 위해": require("@/assets/audios/주저하는 연인들을 위해.mp3"),
  "Not Like Us": require("@/assets/audios/Not Like Us.mp3"),
  "Home Sweet Home": require("@/assets/audios/Home Sweet Home.mp3"),
  "Ditto": require("@/assets/audios/Ditto.mp3"),
  "Bubble Gum": require("@/assets/audios/Bubble Gum.mp3"),
  "yours": require("@/assets/audios/yours.mp3"),
  "한 페이지가 될 수 있게": require("@/assets/audios/한 페이지가 될 수 있게.mp3"),
  "Love Hangover": require("@/assets/audios/Love Hangover.mp3"),
  "그대만 있다면 (영화 '여름날 우리')": require("@/assets/audios/그대만 있다면 (영화 '여름날 우리').mp3"),
  "Bye Bye My Blue": require("@/assets/audios/Bye Bye My Blue.mp3"),
  "Vancouver": require("@/assets/audios/Vancouver.mp3"),
  "사랑으로": require("@/assets/audios/사랑으로.mp3"),
  "Anxiety": require("@/assets/audios/Anxiety.mp3"),
  "Come Over": require("@/assets/audios/Come Over.mp3"),
  "Trip (feat. Hannah)": require("@/assets/audios/Trip (feat. Hannah).mp3"),
  "踊り子": require("@/assets/audios/踊り子.mp3"),
  "Congratulations": require("@/assets/audios/Congratulations.mp3"),
  "blue": require("@/assets/audios/blue.mp3"),
  "좋은 밤 좋은 꿈": require("@/assets/audios/좋은 밤 좋은 꿈.mp3"),
  "Supersonic": require("@/assets/audios/Supersonic.mp3"),
  // "한시 오분 (1:05)": require("@/assets/audios/한시 오분 (1:05).mp3"),
  "Drama": require("@/assets/audios/Drama.mp3"),
  "Pretender": require("@/assets/audios/Pretender.mp3"),
  "예뻤어": require("@/assets/audios/예뻤어.mp3"),
  "Lucky Girl Syndrome": require("@/assets/audios/Lucky Girl Syndrome.mp3"),
  "Silly Dance": require("@/assets/audios/Silly Dance.mp3"),
  "Here With Me": require("@/assets/audios/Here With Me.mp3"),
  "LOVE ATTACK": require("@/assets/audios/LOVE ATTACK.mp3"),
  "Nerdy Love (feat. Yerin Baek)": require("@/assets/audios/Nerdy Love (feat. Yerin Baek).mp3"),
  "TOMBOY": require("@/assets/audios/TOMBOY.mp3"),
  "Supernatural": require("@/assets/audios/Supernatural.mp3"),
  "LAST DANCE": require("@/assets/audios/LAST DANCE.mp3"),
  "무제, 2014": require("@/assets/audios/무제, 2014.mp3"),
  "Spicy": require("@/assets/audios/Spicy.mp3"),
  "굿데이 2025 (텔레파시 + 달빛 창가에서)": require("@/assets/audios/굿데이 2025 (텔레파시 + 달빛 창가에서).mp3"),
  "Sticky": require("@/assets/audios/Sticky.mp3"),
  "어떻게 이별까지 사랑하겠어, 널 사랑하는 거지": require("@/assets/audios/어떻게 이별까지 사랑하겠어, 널 사랑하는 거지.mp3"),
  "영원해": require("@/assets/audios/영원해.mp3"),
  "봄여름가을겨울 (Still Life)": require("@/assets/audios/봄여름가을겨울 (Still Life).mp3"),
  "청춘만화": require("@/assets/audios/청춘만화.mp3"),
  "봄 그리고 너": require("@/assets/audios/봄 그리고 너.mp3"),
  "BIRDS OF A FEATHER": require("@/assets/audios/BIRDS OF A FEATHER.mp3"),
  "UP (KARINA Solo)": require("@/assets/audios/UP (KARINA Solo).mp3"),
  "OMG": require("@/assets/audios/OMG.mp3"),
  "Nice Guy": require("@/assets/audios/Nice Guy.mp3"),
  "IF YOU": require("@/assets/audios/IF YOU.mp3"),
  "Cruel Summer": require("@/assets/audios/Cruel Summer.mp3"),
  "Earth, Wind & Fire": require("@/assets/audios/Earth, Wind & Fire.mp3"),
  "Seeking happy in the crowd": require("@/assets/audios/Seeking happy in the crowd.mp3"),
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        alert('푸시 알림 권한이 필요합니다!');
        return;
      }
  
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
      return token;
    } else {
      alert('푸시 알림은 실제 기기에서만 작동합니다');
    }
  }

  // registerForPushNotificationsAsync();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <RootSiblingParent>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="create" options={{ headerShown: false }} />
          <Stack.Screen name="detail" options={{ headerShown: false }} />
          <Stack.Screen name="Playlist" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </RootSiblingParent>
    </ThemeProvider>
  );
}
