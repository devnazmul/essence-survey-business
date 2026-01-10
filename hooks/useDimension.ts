import {
  heightPercentageToDP as HP,
  widthPercentageToDP as WP,
} from "react-native-responsive-screen";

interface IDimension {
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
}

export const useDimension = (): {
  getResponsiveHeight: (size: IDimension["size"]) => number;
  getResponsiveWidth: (size: IDimension["size"]) => number;
  getResponsiveFontSize: (size: IDimension["size"]) => number;
  WP: (value: any) => number;
  HP: (value: any) => number;
} => {
  const getResponsiveHeight = (size: IDimension["size"]) => {
    switch (size) {
      case "xs":
        return HP("3%");
      case "sm":
        return HP("4%");
      case "md":
        return HP("5%");
      case "lg":
        return HP("6%");
      case "xl":
        return HP("6%");
      case "2xl":
        return HP("7%");
      case "3xl":
        return HP("8%");
      case "4xl":
        return HP("9%");
      case "5xl":
        return HP("10%");
      case "6xl":
        return HP("11%");
      default:
        return HP("5%");
    }
  };

  const getResponsiveWidth = (size: IDimension["size"]) => {
    switch (size) {
      case "xs":
        return HP("3%");
      case "sm":
        return HP("4%");
      case "md":
        return HP("5%");
      case "lg":
        return HP("6%");
      case "xl":
        return HP("6%");
      case "2xl":
        return HP("7%");
      case "3xl":
        return HP("8%");
      case "4xl":
        return HP("9%");
      case "5xl":
        return HP("10%");
      case "6xl":
        return HP("11%");
      default:
        return HP("5%");
    }
  };
  const getResponsiveFontSize = (size: IDimension["size"]) => {
    switch (size) {
      case "xs":
        return HP("1%");
      case "sm":
        return HP("1.2%");
      case "md":
        return HP("1.5%");
      case "lg":
        return HP("1.7%");
      case "xl":
        return HP("1.9%");
      case "2xl":
        return HP("2%");
      case "3xl":
        return HP("2.5%");
      case "4xl":
        return HP("3%");
      case "5xl":
        return HP("4%");
      case "6xl":
        return HP("6%");
      default:
        return HP("1.5%");
    }
  };

  return {
    getResponsiveHeight,
    getResponsiveWidth,
    getResponsiveFontSize,
    HP,
    WP,
  };
};
