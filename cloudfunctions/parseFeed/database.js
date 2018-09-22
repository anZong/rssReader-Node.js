const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.updateFeed = async (feed_url,openid, meta) => {
    console.log('updated...');
    console.log('feed_url:',feed_url);
    console.log('openid:',openid);
    // console.log('meta:',meta);
    let Feed = db.collection('Feed');
    let _feed = await Feed.where({
        url: feed_url
    }).get();
    console.log('feed:',_feed);
    if (!(_feed && _feed.data && _feed.data.length)){
        _feed = await Feed.add({
            data:{
                title: meta.title || '',
                _openid: openid,
                addTime: new Date(),
                pubdate: meta.pubdate || new Date(),
                url: feed_url
            }
        })
        console.log('new feed:',_feed);
    }
    return _feed
}

exports.createPosts = async (items) => {
    console.log('create posts...');
    items = items || [];
    let collection = db.collection('Post');
    return await new Promise((resolve,reject)=>{
        let result = [];
        items.forEach(async (item) => {
            let posts = await collection.where({
                feed_url: item.feed_url,
                title: item.title
            }).get();
            console.log('posts:', posts);
            if (posts && posts.data && posts.data.length) {
                console.log('this post id exited.')
            } else {
                let post = await collection.add({
                    data: item
                })
                result.push(post);
                console.log('new post:', post);
            }
        })
        resolve(result);
    })
}
