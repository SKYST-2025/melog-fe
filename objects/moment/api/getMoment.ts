import AsyncStorage from "@react-native-async-storage/async-storage";
import { Moment } from "../model";

export const getMoment = async (date: string) => {
  return await AsyncStorage.getItem(date)
    .then((v) => {
      if (!v) return null;
      const moment: Moment = JSON.parse(v || "");
      return moment;
    })
    .catch((err) => {
      console.error(err);
    });
};
