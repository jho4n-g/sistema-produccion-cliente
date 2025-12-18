import { useState } from 'react';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs({ tabs, onChange }) {
  const [active, setActive] = useState(tabs[0]?.key);

  const handleChange = (key) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <div className="w-full">
      {/* Tabs header */}
      <div className="inline-flex rounded-2xl bg-slate-100 p-1 ring-1 ring-slate-200">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleChange(tab.key)}
              className={cx(
                'relative rounded-xl px-4 py-2 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-white text-emerald-700 shadow ring-1 ring-green-700'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <span className="pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
