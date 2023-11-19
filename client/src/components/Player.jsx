import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';

export default function Player({ accessToken, trackUri }) {

  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      uris={trackUri ? [trackUri] : []}
      showSaveIcon
      play={true}
      initialVolume={.2}
      styles={{
        color: "#eee",
        sliderHandleColor: "#eee",
        sliderTrackColor: "#eee4",
        sliderColor: "#1cb954",
        bgColor: "#030303",
        trackNameColor: "#eee",
        trackArtistColor: "#bbb",
      }}
    />
  );
}
