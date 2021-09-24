type Comic = {
    name: string
    linkUrl: string
    data: ComicData
    firstSeen: number | null
}

type ComicData = {
    img?: string
    img2?: string
    imgclass?: string
    title?: string
    errors?: string[]
}

window.addEventListener('load', async function () {
    try {
        let comicsResponse = await fetch('/comics')
        hideLoad()
        if (comicsResponse.status != 200) {
            throw new Error(`HTTP ${comicsResponse.status}`)
        }
        let comics: Array<Comic> = await comicsResponse.json()
        updateLocalComicsTimestamp(comics)
        comics.sort((a, b) => b.firstSeen - a.firstSeen)
        comics.forEach((comic) => {
            if (comic.data.errors && comic.data.errors.length > 0) {
                emitError(comic.name, comic.data.errors.join('\n'))
                return
            }
            const comicElement = document.createElement('article')
            const head = document.createElement('h2');
            const link = document.createElement('a');
            link.setAttribute('href', comic.linkUrl);
            link.innerText = comic.name;
            head.appendChild(link);
            comicElement.appendChild(head);

            if (comic.data.img) {
                const p = document.createElement('p');
                const img = document.createElement('img');
                img.setAttribute('src', comic.data.img);
                p.appendChild(img);
                comicElement.appendChild(p);
            }

            if (comic.data.img2) {
                const p = document.createElement('p');
                const img = document.createElement('img');
                img.setAttribute('src', comic.data.img2);
                p.appendChild(img);
                comicElement.appendChild(p);
            }

            if (comic.data.title) {
                let p = document.createElement('p');
                p.innerText = comic.data.title;
                comicElement.appendChild(p);
            }

            for (var image of comicElement.getElementsByTagName('img')) {
                image.addEventListener('click', toggleZoom)
            }
            document.body.appendChild(comicElement)
        })
    } catch (e) {
        hideLoad()
        emitError('Error', e.toString())
    }
})

function hideLoad() {
    document.getElementById('loading').style.display = 'none'
}

function emitError(heading: string, content: string) {
    let error = document.createElement('article')
    error.className = 'error'
    error.innerHTML = `<h2>${heading}</h2><p>${content}</p>`
    document.body.appendChild(error)
}

function toggleZoom(event: MouseEvent) {
    ; (event.target as HTMLImageElement).classList.toggle('zoomed')
}

function updateLocalComicsTimestamp(comics: Array<Comic>) {
    function key(comic: Comic) {
        return (comic.data.img ?? '') + (comic.data.img2 ?? '')
    }

    let currentComicsTimestamps = JSON.parse(
        localStorage.getItem('comicTimestamps') ?? '{}',
    )
    let newComicsTimestamps = {}
    comics.forEach((comic) => {
        let key = (comic.data.img ?? '') + (comic.data.img2 ?? '')
        comic.firstSeen = currentComicsTimestamps[key] ?? Date.now()
        newComicsTimestamps[key] = comic.firstSeen
    })

    localStorage.setItem('comicTimestamps', JSON.stringify(newComicsTimestamps))
}
