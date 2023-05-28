import { ComicDefinition, DirectUrlComic, NavigateParseComic, ParseComic, singleImage, singleImageWithTitle } from './comic'

export var comicDefinitions: ComicDefinition[] = [
  new DirectUrlComic('Lunch', 'https://e24.no', () => {
    const now = new Date().toISOString()
    return 'https://api.e24.no/content/v1/comics/' + now.substring(0, 10)
  }),
  new ParseComic('XKCD', 'https://www.xkcd.com/', ($) => {
    return singleImageWithTitle(
      $('#comic img').attr('src'),
      $('#comic img').attr('title')
    );
  }),
  new ParseComic('Spinnerette', 'https://www.spinnyverse.com', ($) => {
    return singleImage($('img#cc-comic').attr('src'));
  }),
  new ParseComic('Cassiopeia Quinn', 'https://www.cassiopeiaquinn.com/', ($) => {
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
    const img = $('.content img').attr('src');
    if (img) {
      return singleImageWithTitle($('.content img').attr('src'),  $('.content img').attr('title'));
    } else {
      const vidMatch = body.match(/videoId: *"([^"]*)"/)
      if (vidMatch) {
        return {
          media: [{type: 'youtube', id: vidMatch[1]}]
        }
      }
    }
    return {media: []};
  }),
  new NavigateParseComic('Loading Artist', 'https://loadingartist.com/', 
    ($) => { return $('a.comic-thumb.wide').attr('href')! },
    ($) => {
      return {
        media: [
          {type: 'image', href: $('div.main-image-container img').attr('src')},
          {type: 'title', content: $('div.main-image-container img').attr('title')},
          {type: 'html', content: $('div.comic-post article div.body').html() ?? undefined},
        ]
    }
  }),
  new ParseComic('War and Peas', 'https://warandpeas.com/', ($) => {
    return singleImage($('div.entry-content img').attr('src')); 
  }),
  new ParseComic('Poorly Drawn Lines', 'https://poorlydrawnlines.com/', ($) => {
    return singleImage($('div.wp-block-image img').attr('src')); 
  }),
  new NavigateParseComic('The Oatmeal', 'https://theoatmeal.com/comics',
    ($) => { return $('div.comics_list > a').attr('href')! },
    ($) => {
      return {
        media: $('div.comics img, div.ht_comics_container img').map((_, el) => { return {'type': 'image', href: $(el).attr('src') } }).toArray()
      }
    }),
  new ParseComic('ToonHole', 'https://toonhole.com/', ($) => {
    return singleImage($('img.wp-post-image').attr('src')); 
  })
]
