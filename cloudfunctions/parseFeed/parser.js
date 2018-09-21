exports.parseFeed = (url,cbk) => {
    let FeedParser = require('feedparser');
    let request = require('request');
    let req = request(url);
    let feedparser = new FeedParser({
        normalize: true,
        addmeta: false
    })

    req.on('error', (error) => {
        console.error(error);
    })

    req.on('response', function (res) {
        if (res.statusCode !== 200) {
            console.error('request bad');
        } else {
            this.pipe(feedparser);
        }
    })

    feedparser.on('error', (error) => {
        console.error(error);
    })

    let result = {
        meta: null,
        items: [],
    }

    feedparser.on('meta', (meta) => {
        result.meta = {
            title: meta.title,
            pubdate: meta.pubdate
        };
    })

    feedparser.on('readable', function () {
        let item;
        while (item = this.read()) {
            result.items.push(item);
        }
    })

    feedparser.on('end', () => {
        cbk && cbk(result);
    })
}