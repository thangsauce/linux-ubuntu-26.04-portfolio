import React from "react";
import SmallArrow from "./small_arrow";

interface WifiIconProps {
    on?: boolean;
    signal?: number;
    className?: string;
}

export function WifiIcon({ on, signal = 3, className = "w-4 h-4" }: WifiIconProps) {
  const s = on === false ? 0 : signal;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      {on === false ? (
        <>
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" opacity="0.3" />
          <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* outer arc */}
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z" opacity={s >= 3 ? 1 : 0.25} />
          {/* middle arc */}
          <path d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" opacity={s >= 2 ? 1 : 0.25} />
          {/* inner arc + dot */}
          <path d="M9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z" opacity={s >= 1 ? 1 : 0.25} />
        </>
      )}
    </svg>
  );
}

interface StatusProps {
    wifi?: boolean;
    muted?: boolean;
    wifiSignal?: number;
}

export default function Status(props: StatusProps) {
  return (
    <div className="flex justify-center items-center">
      <span className="mx-1.5">
        <WifiIcon on={props.wifi} signal={props.wifiSignal} className="inline status-symbol w-4 h-4" />
      </span>
      <span className="mx-1.5">
        <svg viewBox="0 0 24 24" className="inline status-symbol w-4 h-4" fill="currentColor">
          {props.muted ? (
            <>
              <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19L19 20.27 20.27 19 5.27 4 4.27 3zM12 4L9.91 6.09 12 8.18V4z" opacity="0.3" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
          )}
        </svg>
      </span>
      <span className="mx-1">
        <SmallArrow angle="down" className=" status-symbol" />
      </span>
    </div>
  );
}
