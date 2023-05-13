import React from 'react'

export default function Lyrics({ lyrics, color }) {
  return (
    <div
      className={lyrics ? "lyrics-wrapper reveal" : "lyrics-wrapper"}
      style={{ "--base-color": color }}
    >
      <div className="lyrics">{lyrics}</div>
    </div>
  );
}
