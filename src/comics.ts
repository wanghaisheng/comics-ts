import { ComicDefinition, DirectUrlComic, ParseComic } from './comic'

class DagbladetComic extends ParseComic {
  constructor(name: string, identifier: string) {
    super(name, `http://www.dagbladet.no/tegneserie/${identifier}`, ($) => {
      return {
        img: $('article.callout a.strip-container img').attr('src')!,
      }
    })
  }
}

export var comicDefinitions: ComicDefinition[] = [
  new DirectUrlComic('Lunch', 'https://e24.no', () => {
    var now = new Date().toISOString()
    return 'https://api.e24.no/content/v1/comics/' + now.substring(0, 10)
  }),
  new ParseComic('XKCD', 'https://www.xkcd.com/', ($) => {
    return {
      img: $('#comic img').attr('src'),
      title: $('#comic img').attr('title'),
    }
  }),
  new DagbladetComic('Dunce', 'dunce'),
  new DagbladetComic('Nemi', 'nemi'),
  new ParseComic('Dilbert (English)', 'http://dilbert.com/', ($) => {
    return {
      img: $('img.img-comic').attr('src'),
    }
  }),
  new ParseComic('Spinnerette', 'http://www.spinnyverse.com', ($) => {
    return {
      img: $('img#cc-comic').attr('src'),
    }
  }),
  new ParseComic('Ctrl-Alt-Del', 'https://cad-comic.com/', ($) => {
    return {
      img: $('img.comic-display').attr('src'),
    }
  }),
  new ParseComic('SMBC', 'http://www.smbc-comics.com/', ($) => {
    return {
      img: $('img#cc-comic').attr('src'),
      img2: $('div#aftercomic img').attr('src'),
      title: $('img#cc-comic').attr('title'),
    }
  }),
  new ParseComic('MonkeyUser', 'https://www.monkeyuser.com/?dir=last', ($) => {
    return {
      img: $('.content img').attr('src'),
      title: $('.content img').attr('title'),
    }
  }),
]
