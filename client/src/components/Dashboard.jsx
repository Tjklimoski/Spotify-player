import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import Searchbar from "./Searchbar";
import SearchResults from "./SearchResults";
import Lyrics from "./Lyrics";
import SpotifyControlBar from "./SpotifyControlBar";

const spotifyApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

export default function Dashboard({ code }) {
  //useAuth is a custom hook that manages our API calls.
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [color, setColor] = useState(0);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  function handleOnChange(value) {
    setSearch(value);
  }

  //access lyrics via API
  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3000/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artists[0].name,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics);
        setColor(Math.floor(Math.random() * 360));
      });
  }, [playingTrack]);

  //add access token to our spotifyApi object which will allow us to search for songs and play music from the user's account.
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  //for Searching for tracks/artist
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;

    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImg = track.album.images.reduce(
            (smallest, currentImg) => {
              if (currentImg.height < smallest.height) return currentImg;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artists: track.artists,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImg.url,
          };
        })
      );
    });

    //when search state changes, cancel current search that we may be waiting on a response for.
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <>
      <Searchbar search={search} handleOnChange={handleOnChange} />
      <SearchResults tracks={searchResults} chooseTrack={chooseTrack} />
      <Lyrics lyrics={lyrics} color={color} />
      <SpotifyControlBar
        accessToken={accessToken}
        playingTrack={playingTrack}
      />
    </>
  );
}
