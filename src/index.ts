import express, {Request, response, Response} from 'express'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

import fs from 'fs'
import {join} from 'path'

import dotEnv from 'dotenv';
import cors from 'cors'
import ytdl from 'ytdl-core';
import knex from './database';

const PORT = process.env.PORT || 3333

dotEnv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/v0/sync', async (request: Request, response: Response) => {
  // Retrieve all data that's here on the history table
  const allData = await knex<IMusic>('history')

  // format data
  console.log(allData)

  return response.json({data: allData})

  // return data to the Client
})


interface IAddMusic {
  id: string;
  title: string; 
  url: string;
  duration: string; 
  thumbnail_src: string; 
  username: string
}


interface IMusic {
  id: string;
  cid: string;
  title: string;
  filename: string; 
  streaming_url: string;
  youtube_url: string;
  duration: string; 
  artwork_url: string; 
  artist: string
  playlist: string
}

app.post('/v0/add_music/', async (request: Request, response: Response) => {

  // Get Data from the Request Body
  const {url, id, duration, thumbnail_src, title, username}: IAddMusic = request.body

  // Create a path for the music to be downloaded in
  const filename = `${id}-${Date.now()}.mp3`
  const videoPath = join(__dirname, '..', 'downloads', filename)


  const writeStram = fs.createWriteStream(videoPath)

  
  console.log('downloading music...')
  // Download Music
  ytdl(url, { quality: 'lowestaudio', filter: 'audioonly'})
    .pipe(writeStram)

  // upload all mp3's to Web3.storage

  let NewAddedMusic: IMusic;

  // Once music has finished download upload it to IPFS
  writeStram.on('finish', async () => {
    console.log('download complete')

    const storage = new Web3Storage({token: process.env.API_TOKEN})

    const relativefilepath = `./downloads/${filename}`;

    const file = []
  
    for (let path of [relativefilepath]) {
      const pathfile = await getFilesFromPath(relativefilepath)
      file.push(...pathfile)
    }  

    console.log(`uploading ${videoPath} to Web3.storage...`)
    const cid = await storage.put(file)
    console.log('added music with CID:', cid)

    // format all metadata regarding the musics
    NewAddedMusic  = {
      youtube_url: url, 
      duration, 
      artwork_url: thumbnail_src, 
      title, 
      id, 
      artist: username, 
      cid, 
      filename, 
      playlist: '', 
      streaming_url: `https://${cid}.ipfs.dweb.link/${filename}`
    } 

    
    await knex<IMusic>('history').insert(NewAddedMusic)

    // clean up everything (Delete the file)

    fs.unlink(relativefilepath, () => {
      console.log('Cleaning complete');
    })

    return response.json(NewAddedMusic)
  })

  // add this info in the sqlite DB 
  // return all data to the Client

})


app.listen(PORT, () => console.log(`Servidor Proxy rodando na porta ${PORT}`))