import { useEffect, useMemo, useState } from 'react';

const TIMEZONES = [
  { label: 'Local time', value: 'local' },
  { label: 'UTC', value: 'UTC' },
  { label: 'New York', value: 'America/New_York' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
];

const DEFAULT_WORLD_CLOCKS = ['UTC', 'Europe/London', 'Asia/Tokyo'];

function getClockParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone === 'local' ? undefined : timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone === 'local' ? undefined : timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timeZone === 'local' ? undefined : timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    displayTime: timeFormatter.format(date),
    displayDate: dateFormatter.format(date),
    displayStamp: formatter.format(date),
    secondAngle: date.getSeconds() * 6,
    minuteAngle: date.getMinutes() * 6 + date.getSeconds() * 0.1,
    hourAngle: (date.getHours() % 12) * 30 + date.getMinutes() * 0.5,
  };
}

function AnalogClock({ hourAngle, minuteAngle, secondAngle }) {
  return (
    <div className="analog-clock" aria-hidden="true">
      <div className="clock-face">
        <div className="clock-mark mark-12" />
        <div className="clock-mark mark-3" />
        <div className="clock-mark mark-6" />
        <div className="clock-mark mark-9" />
        <div className="hand hour-hand" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <div className="hand minute-hand" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <div className="hand second-hand" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
        <div className="clock-center" />
      </div>
    </div>
  );
}

function WorldClockCard({ timeZone, onRemove, now }) {
  const clock = getClockParts(now, timeZone);
  const label = TIMEZONES.find((zone) => zone.value === timeZone)?.label ?? timeZone;

  return (
    <article className="world-clock-card">
      <div>
        <p className="world-clock-label">{label}</p>
        <p className="world-clock-time">{clock.displayTime}</p>
        <p className="world-clock-date">{clock.displayDate}</p>
      </div>
      <button type="button" className="remove-clock-button" onClick={() => onRemove(timeZone)}>
        Remove
      </button>
    </article>
  );
}

function App() {
  const [now, setNow] = useState(() => new Date());
  const [timeZone, setTimeZone] = useState('local');
  const [worldClocks, setWorldClocks] = useState(DEFAULT_WORLD_CLOCKS);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const clock = useMemo(() => getClockParts(now, timeZone), [now, timeZone]);

  function addWorldClock() {
    if (timeZone === 'local' || worldClocks.includes(timeZone)) {
      return;
    }

    setWorldClocks((currentClocks) => [timeZone, ...currentClocks]);
  }

  function removeWorldClock(zoneToRemove) {
    setWorldClocks((currentClocks) => currentClocks.filter((zone) => zone !== zoneToRemove));
  }

  return (
    <main className="dashboard">
      <section className="hero-card">
        <div className="header-copy">
          <p className="eyebrow">Basic clock dashboard</p>
          <h1>Live time, one clean view.</h1>
          <p className="subtext">A simple React clock with analog and digital displays plus timezone switching.</p>
        </div>

        <label className="timezone-picker" htmlFor="timezone-select">
          Time zone
          <select id="timezone-select" value={timeZone} onChange={(event) => setTimeZone(event.target.value)}>
            {TIMEZONES.map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="add-clock-button" onClick={addWorldClock}>
          Add to world clocks
        </button>

        <div className="clock-grid">
          <AnalogClock
            hourAngle={clock.hourAngle}
            minuteAngle={clock.minuteAngle}
            secondAngle={clock.secondAngle}
          />

          <div className="digital-panel">
            <p className="digital-time">{clock.displayTime}</p>
            <p className="digital-date">{clock.displayDate}</p>
            <p className="digital-stamp">{clock.displayStamp}</p>
          </div>
        </div>

        <section className="world-clocks-section" aria-label="World clocks">
          <div className="world-clocks-header">
            <div>
              <p className="eyebrow">Dynamic world clocks</p>
              <h2>Saved regions</h2>
            </div>
            <p className="world-clocks-note">Click add after selecting a zone to pin it here.</p>
          </div>

          <div className="world-clocks-grid">
            {worldClocks.map((zone) => (
              <WorldClockCard key={zone} timeZone={zone} now={now} onRemove={removeWorldClock} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
