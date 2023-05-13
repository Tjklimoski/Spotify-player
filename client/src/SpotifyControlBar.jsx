import React from 'react';
import Player from './Player';

export default function SpotifyControlBar({ accessToken, playingTrack}) {
  return (
    <div className="controls">
      <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
    </div>
  );
}
