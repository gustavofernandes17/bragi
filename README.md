# Models 

Music: {
    id: string
    date_added: string
    file_name: string
    cid: string
    title: string, 
    artist: string,
    duration: string, 
    artwork_url: string,
    playlist: string
}

# API Routes

- [x] /v0/add_music 

    Body: {
      ...
    }

    This downloads the video from youtube and uploads it to the Web3.Storage network

    return { Music }

- [x] /v0/sync
    This just syncs the database on the proxy_server with the database on the user device

- [-] /v0/add_playlist/ 

    Body: {
      ...
    }

    this downloads a whole playlist and returns an array with all the information data that was added on Web3.Storage 

    return [ Music ]

- [-] /v0/add/{p}