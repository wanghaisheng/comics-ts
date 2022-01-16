import { ComicDefinition, DirectUrlComic, ParseComic, singleImage, singleImageWithTitle } from './comic'

export var comicDefinitions: ComicDefinition[] = [
  new DirectUrlComic('Lunch', 'https://e24.no', () => {
    var now = new Date().toISOString()
    return 'https://api.e24.no/content/v1/comics/' + now.substring(0, 10)
  }),
  new ParseComic('XKCD', 'https://www.xkcd.com/', ($) => {
    return singleImageWithTitle(
      $('#comic img').attr('src'),
      $('#comic img').attr('title')
    );
  }),
  new ParseComic('Dilbert (English)', 'http://dilbert.com/', ($) => {
    return singleImage($('img.img-comic').attr('src'));
  }),
  new ParseComic('Spinnerette', 'http://www.spinnyverse.com', ($) => {
    return singleImage($('img#cc-comic').attr('src'));
  }),
  new ParseComic('Ctrl-Alt-Del', 'https://cad-comic.com/', ($) => {
    return singleImage($('img.comic-display').attr('src'));
  }),
  new ParseComic('SMBC', 'https://www.smbc-comics.com/', ($) => {
    return {
      media: [
        {type: 'image', href: $('img#cc-comic').attr('src')},
        {type: 'image', href: $('div#aftercomic img').attr('src')},
        {type: 'text', content: $('img#cc-comic').attr('title')}
      ]
    }
  }),
  new ParseComic('MonkeyUser', 'https://www.monkeyuser.com/?dir=last', ($, body) => {
    let img = $('.content img').attr('src');
    if (img) {
      return singleImageWithTitle($('.content img').attr('src'),  $('.content img').attr('title'));
    } else {
      let vidMatch = body.match(/videoId: *"([^"]*)"/)
      if (vidMatch) {
        return {
          media: [{type: 'youtube', href: "https://www.youtube-nocookie.com/embed/" + vidMatch[1]}]
        }
      }
    }
    return {media: []};
  }),
]
