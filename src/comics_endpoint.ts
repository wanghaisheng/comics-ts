import { comicDefinitions } from './comics'

export async function handleComicsRequest(request: Request): Promise<Response> {
  const comicPromises = comicDefinitions.map((c) => c.getComic())
  const comics = await Promise.all(comicPromises)

  return new Response(JSON.stringify(comics))
}
