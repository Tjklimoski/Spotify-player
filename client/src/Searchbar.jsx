import React from "react";

export default function Searchbar({ search, handleOnChange }) {
  return (
    <form className="search-form" onSubmit={e => e.preventDefault()}>
      <input
        className="search"
        type="search"
        placeholder="Search Song/Artists"
        value={search}
        onChange={e => handleOnChange(e.target.value)}
      />
    </form>
  );
}
