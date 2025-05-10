import { ImageBackground } from "expo-image";
import { Moment } from "../model";

export const MomentCard = ({ data }: { data: Moment }) => {
  return <ImageBackground source={data.photoUri}></ImageBackground>;
};
