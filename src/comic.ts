import { CheerioAPI, load } from 'cheerio'

export type Comic = {
  name: string
  linkUrl: string
  data: ComicData
}

export type ComicMedia = {
  id?: string,
  href?: string,
  content?: string,
  type: string
}

export type ComicData = {
  media: ComicMedia[]
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

function fixHtmlUrls(originUrl: string, html?: string): string | undefined {
  if (!html) return html;

  const $ = load(html, {xmlMode: false}, false)
  $('img').attr('src', (_, src) => fixUrl(originUrl, src) as string);
  $('img[srcset]').attr('srcset', (_, srcset) => fixSrcSet(originUrl, srcset));

  return $.html();
}

function fixSrcSet(originUrl: string, srcSet: string): string {
  return srcSet.split(",").map(sc => {
    const urlAndSizes = sc.split(" ").filter(s => s);
    urlAndSizes[0] = fixUrl(originUrl, urlAndSizes[0]) as string;
    return urlAndSizes.join(" ");
  }).join(",");
}

function fixUrls(originUrl: string, cd: ComicData): ComicData {
  return {
    errors: cd.errors,
    media: cd.media.map(m => {
      return {
        ...m,
        href: fixUrl(originUrl, m.href),
        content: m.type == 'html' ? fixHtmlUrls(originUrl, m.content) : m.content
      }
    })
  }
}

function validate(comicData: ComicData) {
  if(!comicData.media)
  {
    comicData.media = []
  }

  comicData.media = comicData.media.filter(m => (m.href || m.content || m.id))
  
  if (!comicData.errors) {
    comicData.errors = []
  }
  if (comicData.media.length == 0) {
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
          media: [],
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
      media: [{
        href: this.imgFactory(),
        type: 'image'
      }]
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
    const response = await this.fetchWithTimeout(this.linkUrl)

    if (response.status != 200) {
      throw new Error(`Failed getting ${this.name}: 'HTTP ${response.status}`)
    }
    let body = await response.text()

    return this.comicFactory(body)
  }
  
  async fetchWithTimeout(input: RequestInfo, init?: RequestInit): Promise<Response>
  {
    const timeout = 2000;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal  
      });  
      return response;
    }
    finally {
      clearTimeout(id);
    }
  }
}

export type ParseComicFactory = (body: CheerioAPI, bodyText: string) => ComicData

export class ParseComic extends LoadedUrlComic {
  constructor(name: string, url: string, comicFactory: ParseComicFactory) {
    super(name, url, (body) => {
      let doc = load(body, {xmlMode: false})
      return comicFactory(doc, body)
    })
  }
}

export function singleImage(href: string | undefined):  ComicData {
  return {
    media: [{type: 'image', href: href}]
  };
}

export function singleImageWithTitle(href: string | undefined, title: string | undefined):  ComicData {
  return {
    media: [{type: 'image', href: href}, {type: 'text', content: title}]
  };
}

// These functions are internal, and are only exported for unit testing
export let exportedForTesting = {
  fixSrcSet: fixSrcSet,
  fixUrls: fixUrls,
  fixHtmlUrls: fixHtmlUrls
}
