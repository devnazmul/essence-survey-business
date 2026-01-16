import IMAGES from "@/assets";
import { Image } from "react-native";

export const getFullImageLink = (url: string) =>
  url
    ? `${process.env.EXPO_PUBLIC_API_BASE_URL}${
        url?.split("/")[0] !== "" ? `/` : ""
      }${url}`
    : Image.resolveAssetSource(IMAGES.placeholderUser).uri;

export default getFullImageLink;
