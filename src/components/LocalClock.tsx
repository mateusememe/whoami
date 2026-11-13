import { useEffect, useState } from "react";

const formatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : null;

/**
 * Live clock in Brasília time. Renders a placeholder on the server and on
 * the first client render (the time is not known at build), then ticks.
 */
export const LocalClock = ({ className }: { className?: string }) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!formatter) return;
    const update = () => setTime(formatter.format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className={className}>
      <span className="tabular-nums">{time ?? "--:--:--"}</span> BRT
    </span>
  );
};
