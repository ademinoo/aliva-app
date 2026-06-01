"use client";

import { useEffect, useState } from "react";

interface CircleScoreProps {
  score: number;       // 0–100
  label?: string;      // ex. "ÉQUILIBRE"
  size?: number;       // px, default 180
  strokeWidth?: number;
}

/**
 * Score de bien-être en arc circulaire SVG animé.
 * Inspiré des maquettes Aliva : arc vert sur fond vert pâle,
 * chiffre centré en Literata, label en Nunito caps.
 */
export function CircleScore({
  score,
  label = "ÉQUILIBRE",
  size = 180,
  strokeWidth = 10,
}: CircleScoreProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth * 2) / 2 - 4;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Score de bien-être : ${score} sur 100`}
      >
        {/* Piste de fond */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#cce8d8"
          strokeWidth={strokeWidth}
        />
        {/* Arc de progression */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#1e5c3a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
        />

        {/* Chiffre */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1c1c1a"
          fontSize={size * 0.24}
          fontFamily="var(--font-literata), Georgia, serif"
          fontWeight="300"
        >
          {score}
        </text>

        {/* Label */}
        {label && (
          <text
            x={cx}
            y={cy + size * 0.17}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#5b5b56"
            fontSize={size * 0.072}
            fontFamily="var(--font-nunito), system-ui, sans-serif"
            fontWeight="600"
            letterSpacing="0.12em"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}
