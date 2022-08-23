const functions = require('firebase-functions');
const cors = require('cors')({ origin: true })
const puppeteer = require('puppeteer');

// contains puppeteer automation functions - evaluates a page based on the parameter "playlist" url. Returns array of number artist and song name.
const getData = async (playlist) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(playlist);
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);

    const songDetails = await page.evaluate(() => {
        let songArr = []
        const songDiv = document.querySelectorAll('.trackList__list li .trackItem')

        songDiv.forEach((song, index) => {
            const songContent = song.querySelector('.trackItem__content')
            let artistName
            const songName = songContent.querySelector(".trackItem__trackTitle").innerText
            if (songContent.querySelector(".trackItem__username") !== null) {
                artistName = songContent.querySelector(".trackItem__username").innerText
                songArr.push({ number: index + 1, artist: artistName, song: songName })
            } else {
                songArr.push({ number: index + 1, song: songName })
            }
        })
        return songArr
    })

    // console.log(songDetails)
    await browser.close()
    return songDetails
};


// Scrolls the page to ensure everything is loaded before we call our main function. URL : https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
async function autoScroll(page) {
    await page.evaluate(async () => {
        // eslint-disable-next-line no-unused-vars
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}


exports.scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        // example json request 
        // const json = '{"text": "https://soundcloud.com/megan-thee-stallion/sets/traumazine"}';
        const body = JSON.parse(request.body)
        const data = await getData(body.url)
        response.send(data)
    })
})