import { comicDefinitions } from './comics'

export async function handleComicsRequest(request: Request): Promise<Response> {
  let comicPromises = comicDefinitions.map((c) => c.getComic())
  let comics = await Promise.all(comicPromises)

  return new Response(JSON.stringify(comics))
}
