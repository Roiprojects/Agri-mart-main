'use client';

import React from 'react';

export default function FieldContourDecoration() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        className="absolute -top-12 -left-12 w-[115%] h-[125%] opacity-35 animate-driftSlow text-agri-green"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Natural organic agricultural contour lines */}
        <path
          d="M -100 120 C 200 80, 450 180, 750 130 C 1050 80, 1200 160, 1350 120"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 8"
          strokeOpacity="0.25"
        />
        <path
          d="M -100 240 C 180 200, 420 300, 720 250 C 1020 200, 1180 280, 1350 230"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.2"
        />
        <path
          d="M -100 360 C 250 320, 500 420, 800 370 C 1100 320, 1220 400, 1350 350"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          strokeOpacity="0.18"
        />
        <path
          d="M -100 480 C 150 440, 380 540, 680 490 C 980 440, 1150 520, 1350 470"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.15"
        />
      </svg>
    </div>
  );
}
