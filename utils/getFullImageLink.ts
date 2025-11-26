export const getFullImageLink = (url: string) =>
  `${process.env.EXPO_PUBLIC_API_BASE_URL}${
    url?.split("/")[0] !== "" ? `/` : ""
  }${url}`;

export default getFullImageLink;
