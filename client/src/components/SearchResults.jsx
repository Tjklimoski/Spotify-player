import React from 'react';
import TrackSearchResult from './TrackSearchResult';

export default function SearchResults({ tracks, chooseTrack }) {
  return (
    <div className="results">
      {tracks.map((track) => {
        return (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        );
      })}
    </div>
  );
}
