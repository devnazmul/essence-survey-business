import { formatRole } from "./formatRole";

export const getFullName = (name: any) => {
  const nameArray = [
    name?.title,
    name?.first_Name,
    name?.middle_Name,
    name?.last_Name,
  ];
  const filteredName = nameArray?.filter((n) => n);
  return filteredName?.length > 0 ? formatRole(filteredName?.join(" ")) : "N/A";
};
