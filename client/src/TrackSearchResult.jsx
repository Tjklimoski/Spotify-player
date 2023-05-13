import React from 'react'

export default function TrackSearchResult({ track, chooseTrack }) {

  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div className="search-result" onClick={handlePlay}>
      <img src={track.albumUrl} alt="album img"/>
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artists">
          {track.artists.map(artist => {
            return <span key={artist.name}>{artist.name}</span>
          })}
        </div>
      </div>
    </div>
  );
}
