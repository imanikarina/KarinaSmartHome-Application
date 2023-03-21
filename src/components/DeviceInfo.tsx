import { twoDigitString } from '@/util/format';
import styled from '@emotion/styled';
import { parse } from 'date-fns';
import React, { ChangeEvent, useMemo, useState } from 'react';
import tw from 'twin.macro';
import Button from './Button';
import Timer from './Timer';

type Props = {
  deviceName: string;
  isDeviceOn: boolean;
  onTimer?: Date;
  offTimer?: Date;
  changeHandlers: {
    onToggleDevice: () => void;
    onTimerSubmit: (info: {time?: Date; timerType: 'on' | 'off'}) => void;
  }
  sessionStart: Date;
}

const Card = tw.div`border w-80 px-6 py-4 rounded`;
const CardHeader = tw.div`flex flex-row justify-between items-baseline mb-4`;
const DeviceName = tw.div`font-semibold text-xl`;
const CardToggle = styled(Button)<{on?: boolean}>(({on}) => [
  tw`w-16`,
  on && tw`bg-green-500 hover:bg-green-600`,
  !on && tw`bg-red-500 hover:bg-red-600`,
]);
const Section = tw.div`border-t py-4`;
const InfoItem = tw.div`flex flex-row items-center h-9`;
const InfoItemLabel = tw.div`w-36`;
const H3 = tw.h3`font-semibold mb-3`;
const Input = tw.input`border px-2 py-1 rounded`;
const Radio = tw.label`ml-4 flex flex-row space-x-2`;
const IconButtonWrapper = tw(Button)`rounded-full bg-transparent opacity-60 hover:(bg-gray-100 opacity-100) text-[22px] leading-none text-gray-500 p-0 w-6 h-6 relative ml-2 mt-px`;

function IconButton({onClick}: {onClick?: () => void}) {
  return (
    <IconButtonWrapper onClick={onClick}>
      <div tw="absolute bottom-[3px] left-[4.5px]">×</div>
    </IconButtonWrapper>
  )
}

export default function DeviceInfo({isDeviceOn, deviceName, onTimer, offTimer, changeHandlers, sessionStart}: Props) {
  const formatTime = (time: Date) => {
    return `${twoDigitString(time.getHours())}:${twoDigitString(time.getMinutes())}`
  }
  const onTimerString = useMemo(() => onTimer ? formatTime(onTimer) : '--:--', [onTimer]);
  const offTimerString = useMemo(() => offTimer ? formatTime(offTimer) : '--:--', [offTimer]);

  const [timerInput, setTimerInput] = useState<string>();
  const [timerType, setTimerType] = useState<'on' | 'off'>('on');

  const onTimerTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimerType(e.currentTarget.value as ('on' | 'off'));
  }

  const onTimerSubmit = () => {
    if (!timerInput) {
      return;
    }
    const dateValue = parse(timerInput, 'HH:mm', new Date());
    changeHandlers.onTimerSubmit({time: dateValue, timerType});
  };

  const resetOnTimer = () => {
    changeHandlers.onTimerSubmit({time: undefined, timerType: 'on'});
  };
  const resetOffTimer = () => {
    changeHandlers.onTimerSubmit({time: undefined, timerType: 'off'});
  }

  return (
    <>
      <Card>
        <CardHeader>
          <DeviceName>{deviceName}</DeviceName>
          <CardToggle on={isDeviceOn} onClick={changeHandlers.onToggleDevice} id={`${deviceName}Toggle`}>
            {isDeviceOn ? 'ON' : 'OFF'}
          </CardToggle>
        </CardHeader>
        <Section>
          <InfoItem>
            <InfoItemLabel>Current Session</InfoItemLabel>
            <Timer startTime={sessionStart} running={isDeviceOn} />
          </InfoItem>
          <InfoItem>
            <InfoItemLabel>On Timer</InfoItemLabel>
            {onTimerString}
            {onTimer && <IconButton onClick={resetOnTimer} />}
          </InfoItem>
          <InfoItem>
            <InfoItemLabel>Off Timer</InfoItemLabel>
            {offTimerString}
            {offTimer && <IconButton onClick={resetOffTimer} />}
          </InfoItem>
        </Section>
        <Section>
          <H3>Set a timer</H3>
          <div tw="flex flex-row items-center mb-4">
            <Input type="time"  onChange={(e) => setTimerInput(e.target.value)} />
            <Radio>
              <input
                type="radio"
                name={`${deviceName}TimerType`}
                value="on"
                checked={timerType === 'on'}
                onChange={onTimerTypeChange}
              />
              <div>On</div>
            </Radio>
            <Radio>
              <input
                type="radio"
                name={`${deviceName}TimerType`}
                value="off"
                checked={timerType === 'off'}
                onChange={onTimerTypeChange}
              />
              <div>Off</div>
            </Radio>
          </div>
          <Button tw="w-full" disabled={!timerInput} onClick={onTimerSubmit}>
            Submit
          </Button>
        </Section>
      </Card>
    </>
  );
}