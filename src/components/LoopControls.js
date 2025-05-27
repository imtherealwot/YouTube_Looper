import React, { useEffect, useState } from "react";
import { Range } from "react-range";

const STEP = 0.1;
const PERCENT_MAX = 100;

function LoopControls({ loopSettings, onChange, duration, playerRef }) {
  const [sliderValues, setSliderValues] = useState([0, 100]);

  useEffect(() => {
    if (duration > 0) {
      const startPercent = (loopSettings.start / duration) * PERCENT_MAX;
      const endPercent = (loopSettings.end / duration) * PERCENT_MAX;
      setSliderValues([startPercent, endPercent]);
    }
  }, [loopSettings, duration]);

  const adjust = (field, delta) => {
    const value = parseFloat((loopSettings[field] + delta).toFixed(2));
    onChange({ ...loopSettings, [field]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...loopSettings, [name]: parseFloat(value) });
  };

  const handleSpeedChange = (e) => {
    onChange({ ...loopSettings, speed: parseFloat(e.target.value) });
  };

  const handleSliderChange = (values) => {
    setSliderValues(values);
    const [startPercent, endPercent] = values;
    const start = parseFloat(((startPercent / PERCENT_MAX) * duration).toFixed(2));
    const end = parseFloat(((endPercent / PERCENT_MAX) * duration).toFixed(2));
    onChange({ ...loopSettings, start, end });
  };

  const setNow = (field) => {
    if (!playerRef?.current || typeof playerRef.current.getCurrentTime !== "function") {
      console.warn("Player not ready or getCurrentTime unavailable");
      return;
    }

    const currentTime = playerRef.current.getCurrentTime();
    console.log("playerRef.current", playerRef?.current);

    if (typeof currentTime === "number") {
      const rounded = parseFloat(currentTime.toFixed(2));
      console.log(`Setting ${field} to`, rounded);
      onChange({ ...loopSettings, [field]: rounded });
    }
  };


  return (
    <div className="mb-4 space-y-4 w-full">
      {["start", "end"].map((field) => (
        <div key={field} className="flex items-center space-x-2">
          <span className="w-20 capitalize">{field}:</span>
          <button onClick={() => adjust(field, -0.1)} className="text-xl px-3 py-1 bg-gray-200 rounded">−</button>
          <input
            type="number"
            name={field}
            step="0.01"
            value={loopSettings[field]}
            onChange={handleInputChange}
            className="w-20 border p-1 text-center"
          />
          <button onClick={() => adjust(field, 0.1)} className="text-xl px-3 py-1 bg-gray-200 rounded">+</button>
          <button
            onClick={() => setNow(field)}
            className="text-xs px-2 py-1 bg-blue-200 rounded"
          >
            Now
          </button>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium">Speed: {loopSettings.speed}x</label>
        <input
          type="range"
          min="0.25"
          max="1"
          step="0.05"
          value={loopSettings.speed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>

      {duration > 0 && (
        <div className="flex justify-center w-full">
          <div className="w-full max-w-screen-lg px-2">
            <label className="block text-sm font-medium mb-2">Trackbar (Start/End)</label>
            <Range
              step={STEP}
              min={0}
              max={PERCENT_MAX}
              values={sliderValues}
              onChange={handleSliderChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="w-full"
                  style={{
                    ...props.style,
                    height: "8px",
                    backgroundColor: "#ddd",
                    borderRadius: "4px",
                    marginTop: "10px"
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "16px",
                    width: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#6b21a8"
                  }}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LoopControls;
