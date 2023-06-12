import { comicDefinitions } from './comics'

export async function handleComicsRequest(request: Request): Promise<Response> {
  const comicPromises = comicDefinitions.map((c) => c.name)
  const comics = await Promise.all(comicPromises)

  return new Response(JSON.stringify(comics))
}


export async function handleComicRequest(request: Request, comicName: string): Promise<Response> {
  const matchingComics = comicDefinitions.filter(c => c.name == comicName)
  if(matchingComics.length > 0)
  {
    const comic = await matchingComics[0].getComic()
    return new Response(JSON.stringify(comic))
  }

  return new Response("comic not found",  {status: 404})
}
