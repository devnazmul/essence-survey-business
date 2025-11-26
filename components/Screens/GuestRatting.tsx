import { useState } from "react";
import OverallRating from "./OverallRating";
import Rating from "./Rating";

const GuestRating = ({}) => {
  const [currentTab, setCurrentTab] = useState<"overall" | "survey">("overall");

  if (currentTab === "overall") {
    return <OverallRating />;
  } else if (currentTab === "survey") {
    return <Rating />;
  } else {
    return <div>You can&apos;t rate</div>;
  }
};

export default GuestRating;
