import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
  function handlePlay() {
    chooseTrack(track);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handlePlay();
  }

  return (
    <div
      className="search-result"
      onClick={handlePlay}
      tabIndex={0}
      aria-label={`Play ${track.title}`}
      onKeyDown={handleKeyDown}
    >
      <img src={track.albumUrl} alt="album img" />
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artists">
          {track.artists.map(artist => {
            return <span key={artist.name}>{artist.name}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
