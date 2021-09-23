import { CheerioAPI, load } from 'cheerio'

export type Comic = {
  name: string
  linkUrl: string
  data: ComicData
}

export type ComicData = {
  img?: string
  img2?: string
  title?: string
  errors?: string[]
}

function fixUrl(originUrl: string, url?: string): string | undefined {
  if (!url) return url

  let parsedOrigin = new URL(originUrl)
  if (url.startsWith('//')) {
    url = parsedOrigin.protocol + url
  }

  return new URL(url, originUrl).href
}

function fixUrls(originUrl: string, cd: ComicData): ComicData {
  return {
    ...cd,
    img: fixUrl(originUrl, cd.img)!,
    img2: fixUrl(originUrl, cd.img2),
  }
}

function validate(comicData: ComicData) {
  if (!comicData.errors) {
    comicData.errors = []
  }
  if (!comicData.img) {
    comicData.errors.push('Could not load comic')
  }
}

export abstract class ComicDefinition {
  name: string
  linkUrl: string

  constructor(name: string, linkUrl: string) {
    this.name = name
    this.linkUrl = linkUrl
  }

  abstract loadComicData(): Promise<ComicData>

  async getComic(): Promise<Comic> {
    try {
      let comicData = await this.loadComicData()
      validate(comicData)
      return {
        name: this.name,
        linkUrl: this.linkUrl,
        data: fixUrls(this.linkUrl, comicData),
      }
    } catch (e: any) {
      return {
        name: this.name,
        linkUrl: this.linkUrl,
        data: {
          errors: [e.toString()],
        },
      }
    }
  }
}

export type DirectUrlImageFactory = () => string

export class DirectUrlComic extends ComicDefinition {
  imgFactory: DirectUrlImageFactory

  constructor(
    name: string,
    linkUrl: string,
    imgFactory: DirectUrlImageFactory,
  ) {
    super(name, linkUrl)
    this.imgFactory = imgFactory
  }

  loadComicData(): Promise<ComicData> {
    return Promise.resolve({
      img: this.imgFactory(),
    })
  }
}

export type UrlLoaderFactory = (body: string) => ComicData

export class LoadedUrlComic extends ComicDefinition {
  comicFactory: UrlLoaderFactory

  constructor(name: string, url: string, comicFactory: UrlLoaderFactory) {
    super(name, url)
    this.comicFactory = comicFactory
  }

  async loadComicData(): Promise<ComicData> {
    const response = await fetch(this.linkUrl)

    if (response.status != 200) {
      throw new Error(`Failed getting ${this.name}: 'HTTP ${response.status}`)
    }
    let body = await response.text()

    return this.comicFactory(body)
  }
}

export type ParseComicFactory = (body: CheerioAPI) => ComicData

export class ParseComic extends LoadedUrlComic {
  constructor(name: string, url: string, comicFactory: ParseComicFactory) {
    super(name, url, (body) => {
      let doc = load(body)
      return comicFactory(doc)
    })
  }
}
