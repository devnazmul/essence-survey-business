export const formatRole = (inputString: string) => {
  let formattedString = inputString;
  if (inputString?.includes("#")) {
    // IF HAVE  BUSINESS ID
    formattedString = inputString?.split("#")[0];
  }
  formattedString = formattedString?.replace(/_/g, " ");
  return formattedString
    ?.split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
