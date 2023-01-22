import { exportedForTesting } from '../src/comic'

const fixSrcSet = exportedForTesting.fixSrcSet;
const fixHtmlUrls = exportedForTesting.fixHtmlUrls;

describe('comic', () => {

  test('fixSrcSet', () => {
    const result = fixSrcSet("https://example.com", "/img/foo.jpg 1x, /img/bar.jpg 2x");

    expect(result).toEqual("https://example.com/img/foo.jpg 1x,https://example.com/img/bar.jpg 2x");
  })

  test('fixHtmlUrls', () => {
    const result = fixHtmlUrls("https://example.com", '<p>Blurble <a href="https://example.com">bloop<img src="/img/a" srcset="/img/a 1x, /img/b 2x"></a>Floof</p><p>Zorg<img src="/img/c"></p>');
    expect(result).toEqual('<p>Blurble <a href="https://example.com">bloop<img src="https://example.com/img/a" srcset="https://example.com/img/a 1x,https://example.com/img/b 2x"></a>Floof</p><p>Zorg<img src="https://example.com/img/c"></p>')
  });
})
