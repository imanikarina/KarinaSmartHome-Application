import React, {useEffect, useState} from "react";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  const updateTime = (now: Date) => {
    setCurrentTime(now);
  };

  useEffect(() => {
    const interval = setInterval(() => updateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {currentTime.toTimeString()}
    </>
  )
}