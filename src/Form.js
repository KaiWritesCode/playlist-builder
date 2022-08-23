import React, { useState, useEffect } from 'react'

export default function Form() {
    const [playlistInputVal, setPlaylistInputVal] = useState("");
    const [songArr, setSongArr] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch("http://localhost:5001/web-scrap123/us-central1/scraper", {

            method: 'POST',
            body: JSON.stringify({ "url": playlistInputVal })

        })

        const data = await res.json()
        setSongArr(data)
        console.log(data)


    }

    const songList = songArr.map((song) => {
        return (
            <li key={song.number}>
                <div>{song.number}</div>
                <div>{song.song}</div>
                <div>{song.artistName && song.artistName}</div>
            </li>
        )
    })

    return (
        <>
            <main className="container">
                <nav className='flex'>
                    <div className='text-3xl font-bold'>Home</div>
                    <div>Explore playlists</div>
                    <div>Explore trending</div>
                    <div>Guide</div>
                </nav>
                <section className="hero">
                    <h1>Copy Music Playlists</h1>
                </section>

                <section className="form-container" >
                    <form id="form" onSubmit={handleSubmit}>
                        <label htmlFor="playlistInput">Playlist URL</label>
                        <input onChange={e => setPlaylistInputVal(e.target.value)} id="playlistInput" type="text" placeholder="https://soundcloud.com/example" />
                        <button>Submit</button>
                    </form>

                </section>

                <section className="results-section">
                    <ul>
                        {songList}
                    </ul>
                </section>
            </main>
        </>
    )
}
