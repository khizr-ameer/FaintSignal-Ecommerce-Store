import React, { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Thermometer component
 *
 * Features:
 * - Vertical modern thermometer look (gradient tube)
 * - Draggable/keyboard-friendly range (rotated input)
 * - Live temperature number + season label
 * - "Browse" buttons that navigate to collection handles (uses routes like /men/tops or /women/tops)
 *
 * How it decides collections:
 * - Provide a mapping of temperature ranges -> collection handles (below)
 * - This component ships with an example mapping used by default
 *
 * Usage:
 * <Thermometer />
 *
 * You can customize the mapping by passing `mapping` prop:
 * <Thermometer mapping={[{min:-10,max:5,label:'Winter',collections:[{title:'Coats',path:'/men/outerwear'}]}]} />
 */

const defaultMapping = [
  { min: -30, max: 5, label: "Deep Winter", collections: [{ title: "Coats", path: "/men/outerwear" }, { title: "Wool Sweaters", path: "/women/outerwear" }] },
  { min: 6, max: 15, label: "Chilly", collections: [{ title: "Knitwear", path: "/men/tops" }, { title: "Cardigans", path: "/women/tops" }] },
  { min: 16, max: 22, label: "Mild", collections: [{ title: "Layering", path: "/men/tops" }, { title: "Light Jackets", path: "/women/outerwear" }] },
  { min: 23, max: 30, label: "Warm", collections: [{ title: "Tees", path: "/men/tops" }, { title: "Dresses", path: "/women/tops" }] },
  { min: 31, max: 50, label: "Hot", collections: [{ title: "Shorts", path: "/men/bottoms" }, { title: "Swim", path: "/women/bottoms" }] },
];

function findMappingForTemp(mapping, t) {
  return mapping.find((m) => t >= m.min && t <= m.max) || null;
}

export default function Thermometer({
  min = -10,
  max = 40,
  step = 1,
  initial = 18,
  mapping = defaultMapping,
  className = "",
}) {
  const navigate = useNavigate();
  const [temp, setTemp] = useState(() => Math.max(min, Math.min(max, initial)));
  const current = useMemo(() => findMappingForTemp(mapping, temp), [mapping, temp]);

  const onChange = useCallback((e) => {
    const v = Number(e.target.value);
    setTemp(v);
  }, []);

  // keyboard increase/decrease helper
  const handleKey = useCallback((e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      setTemp((t) => Math.min(max, t + step));
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      setTemp((t) => Math.max(min, t - step));
    }
  }, [min, max, step]);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <h3 className="text-2xl md:text-3xl font-montreal font-bold text-gray-900 mb-6 text-center">
        Browse products by temperature
      </h3>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Thermometer visual */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Tube */}
          <div className="relative flex items-center">
            {/* Labels left */}
            <div className="hidden md:flex flex-col items-end mr-4 text-sm text-gray-600">
              <span className="-mb-8">Hot</span>
              <span className="mt-24">Warm</span>
              <span className="mt-24">Mild</span>
              <span className="mt-24">Chilly</span>
              <span className="mt-24">Winter</span>
            </div>

            {/* The actual tube + rotated range input */}
            <div className="relative w-14 md:w-16 h-80 md:h-96 flex items-center justify-center">
              {/* background tube with gradient */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-6 md:w-8 h-[88%] rounded-3xl overflow-hidden border border-white/10 shadow-inner"
                  style={{
                    background: "linear-gradient(180deg,#ff7a59 0%,#ffae42 30%,#ffd166 50%,#7ad1ff 75%,#5aa6ff 100%)",
                  }}
                />
              </div>

              {/* Range input rotated to vertical */}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={temp}
                onChange={onChange}
                onKeyDown={handleKey}
                aria-label="Temperature"
                className="relative z-10 -rotate-90 w-80 md:w-[360px] appearance-none bg-transparent focus:outline-none"
                style={{ WebkitAppearance: "none" }}
              />

              {/* Knob (visual) */}
              <motion.div
                key={temp}
                layout
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.15))",
                }}
              >
                <div className="text-sm md:text-base font-medium">{temp}°</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Selected temperature</div>
              <div className="text-3xl font-montreal font-bold text-gray-900">{temp}°C</div>
              <div className="mt-2 text-sm text-gray-600">
                {current ? current.label : temp <= min ? "Very cold" : "Very warm"}
              </div>
            </div>

            {/* little color indicator */}
            <div
              aria-hidden
              className="w-14 h-14 rounded-xl border border-gray-200"
              style={{
                background: `linear-gradient(135deg, rgba(${Math.max(0, 255 - (temp * 3))},${Math.max(0, Math.min(255, 120 + temp * 2))},${Math.max(0, 200 - temp)} , 0.95), transparent)`,
              }}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">Suggested collections</div>

            <div className="flex flex-wrap gap-3">
              {current?.collections?.map((c) => (
                <button
                  key={c.path}
                  onClick={() => navigate(c.path)}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
                >
                  {c.title}
                </button>
              ))}

              {/* fallback if no collection */}
              {!current && (
                <div className="text-sm text-gray-600">No suggestions for this temperature</div>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {/* Browse first collection */}
            {current?.collections?.[0] && (
              <button
                onClick={() => navigate(current.collections[0].path)}
                className="px-4 py-2 rounded-lg bg-gold text-dark font-medium hover:brightness-95 transition"
              >
                Browse {current.collections[0].title}
              </button>
            )}

            {/* Browse all (go to menu or full browse page) */}
            <button
              onClick={() => navigate("/men")}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              Browse all
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Tip: drag the knob or use arrow keys to change temperature.
          </div>
        </div>
      </div>
    </div>
  );
}
