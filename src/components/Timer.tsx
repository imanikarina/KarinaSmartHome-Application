import { twoDigitString } from "@/util/format";
import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";

type Props = {
  startTime: Date;
  running?: boolean;
}

export default function Timer({startTime, running}: Props) {
  const [hourDiff, setHourDiff] = useState<number>(0);
  const [minuteDiff, setMinuteDiff] = useState<number>(0);
  const [secondDiff, setSecondDiff] = useState<number>(0);

  const updateTime = (now: Date) => {
    const diff = differenceInSeconds(now, startTime);
    setHourDiff(Math.floor(diff / (60 * 60)));
    setMinuteDiff(Math.floor(diff / 60));
    setSecondDiff(Math.floor(diff % 60));
  }

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => updateTime(new Date()), 1000);
      return () => clearInterval(interval);
    } else {
      setHourDiff(0);
      setMinuteDiff(0);
      setSecondDiff(0);
    }
  }, [running]);

  return (
    <>
      {twoDigitString(hourDiff)}:{twoDigitString(minuteDiff)}:{twoDigitString(secondDiff)}
    </>
  )
}