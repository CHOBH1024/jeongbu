import CountUp from 'react-countup';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function CountUpNumber({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5 }: Props) {
  return (
    <CountUp
      end={value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={duration}
      separator=","
      useEasing={true}
    />
  );
}
