// src/components/FieldSelect.tsx
import React, { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

// Simple check icon
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 111.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

type Option<T> = { label: string; value: T; disabled?: boolean };

type FieldSelectProps<T> = {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder?: string;
  /** Optional client-side filter box for long lists */
  searchable?: boolean;
  className?: string;
};

export function FieldSelect<T extends string | number>({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchable = false,
  className = "",
}: FieldSelectProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, searchable, query]);

  const selected = options.find((o) => o.value === value);

  return (
     <Listbox as="div" value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          className="relative w-full cursor-default rounded border border-slate-700 bg-slate-800/70 px-3 py-2 text-left text-slate-100 shadow-sm outline-none ring-0 focus:border-indigo-400 focus:outline-none"
        >
          <span className={`block truncate ${selected ? "" : "text-slate-400"}`}>
            {selected ? selected.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <ChevronIcon className="h-4 w-4 text-slate-400" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Listbox.Options className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-700 bg-slate-900/95 p-1 shadow-lg backdrop-blur-md focus:outline-none">
            {searchable && (
              <div className="p-1">
                <input
                  autoFocus
                  className="w-full rounded border border-slate-700 bg-slate-800/70 px-2 py-1 text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-400"
                  placeholder="Search…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">No results</div>
            ) : (
              filtered.map((opt) => (
                <Listbox.Option
                  key={`${String(opt.value)}`}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={({ active, disabled }) =>
                    [
                      "relative cursor-default select-none rounded px-3 py-2 text-sm",
                      active ? "bg-indigo-600/20 text-slate-100" : "text-slate-200",
                      disabled ? "opacity-40" : "",
                    ].join(" ")
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span className={`truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {opt.label}
                      </span>
                      {selected ? (
                        <CheckIcon className="h-4 w-4 text-indigo-400" />
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
