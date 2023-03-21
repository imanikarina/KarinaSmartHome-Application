import { format, differenceInSeconds } from "date-fns";
import { useCallback, useState } from "react";
import { hundredHour, twoDigitString } from '@/util/format';
import MQTT from './mqtt';

function useDeviceHandler(deviceName: string) {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [onTimer, setOnTimer] = useState<Date>();
  const [offTimer, setOffTimer] = useState<Date>();
  const deviceCode = deviceName === 'Lamp' ? 'A' : 'B';

  const toggleDevice = () => {
    if (isOn) {
      MQTT.publishMessage("0" + deviceCode + "0");
      setIsOn(false);
      const diff = differenceInSeconds(new Date(), startTime);
      const hourDiff = Math.floor(diff / (60 * 60));
      const minuteDiff = Math.floor(diff / 60);
      const secondDiff = Math.floor(diff % 60);
      const log = document.getElementById('Log');
      if (log) {
        log.innerHTML += `Turned off ${deviceName} after ${twoDigitString(hourDiff)}:${twoDigitString(minuteDiff)}:${twoDigitString(secondDiff)}.<br/>`;
      }
      setStartTime(new Date());
    }
    if (!isOn) {
      MQTT.publishMessage("0" + deviceCode + "1");
      setIsOn(true);
      setStartTime(new Date());
    }
  };

  const handleTimerSubmit = ({time, timerType}: {time?: Date; timerType: 'on' | 'off'}) => {
    if (timerType === 'on') {
      MQTT.publishMessage("2" + deviceCode + hundredHour(time));
      setOnTimer(time);
    };
    if (timerType === 'off') {
      MQTT.publishMessage("1" + deviceCode + hundredHour(time));
      setOffTimer(time);
    };
  };

  return {
    isOn,
    toggleDevice,
    startTime,
    onTimer,
    offTimer,
    setOnTimer,
    setOffTimer,
    handleTimerSubmit,
  }
}

export default function useHomeViewModel() {
  const lampHandler = useDeviceHandler('Lamp');
  const acHandler = useDeviceHandler('AC');

  const [isConnected, setIsConnected] = useState<boolean>(false);

  const toggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      MQTT.startDisconnect();
    }
    if (!isConnected) {
      const currentDate = new Date();
      const stamp = 
        format(currentDate, 'HHmmss') + "-" +
        hundredHour(lampHandler.offTimer) + "-" +
        hundredHour(lampHandler.onTimer) + "-" +
        hundredHour(acHandler.offTimer) + "-" +
        hundredHour(acHandler.onTimer);
      MQTT.startConnect(stamp);
      setIsConnected(true);
    }
  };

  return {
    isConnected,
    toggleConnection,
    lampHandler,
    acHandler,
  }
}