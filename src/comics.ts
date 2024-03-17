import { ComicDefinition, DirectUrlComic, NavigateParseComic, ParseComic, singleImage, singleImageWithTitle } from './comic'

export var comicDefinitions: ComicDefinition[] = [
  new DirectUrlComic('Lunch', 'https://e24.no', (_) => {
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
          {type: 'title', content: $('div.main-image-container img').attr('title')}
        ]
    }
  }),
  new ParseComic('War and Peas', 'https://warandpeas.com/', ($) => {
    return singleImage($('div.entry-content img').attr('src')); 
  }),
  new ParseComic('Poorly Drawn Lines', 'https://poorlydrawnlines.com/', ($) => {
    return singleImage($('div.wp-block-image img').attr('src')); 
  }),
  new ParseComic('ToonHole', 'https://toonhole.com/', ($) => {
    return singleImage($('img.wp-post-image').attr('src')); 
  }),
  new NavigateParseComic('Work Chronicles', 'https://workchronicles.substack.com/archive', 
    ($) => {
      return $('a.pencraft').attr('href') ?? "https://example.com/";
    },
    ($) => {
      return singleImage($('picture img').attr('src')?.replace("w_120,", "w_800,"));
    }),
  new ParseComic('Tales of Absurdity', 'https://talesofabsurdity.com/', ($) => {
    return singleImage($('div#unspliced-comic img.size-full').attr('src'));
  }),
  new ParseComic('Portugese Geese', 'https://portuguesegeese.com/', ($) => {
    return singleImage($('figure.wp-block-image.size-full img').attr('src'));
  })
]
