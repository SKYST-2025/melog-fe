import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
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

export const getAllMomentsInCurrentMonth = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const dateStrings = Array.from({ length: lastDay }, (_, i) =>
    format(new Date(year, month, i + 1), "yyyy-MM-dd")
  );

  const moments = await Promise.all(
    dateStrings.map(async (date) => ({
      date,
      moment: await getMoment(date),
    }))
  );

  return moments;
};
