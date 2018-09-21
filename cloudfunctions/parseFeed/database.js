const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.updateFeed = (feed_url,openid, meta) => {
    console.log('updated...');
    console.log('feed_url:',feed_url);
    console.log('openid:',openid);
    // console.log('meta:',meta);
    let Feed = db.collection('Feed');
    Feed.where({
        url: feed_url
    }).get().then((rres)=>{
        console.log('rres:',rres);
        if (!(rres && rres.data && rres.data.length)){
            Feed.add({
                data:{
                    title: meta.title,
                    _openid: openid,
                    addTime: new Date(),
                    pubdate: meta.pubdate,
                    url: feed_url
                }
            })
        }
    })
}

exports.createPosts = (items) => {
    console.log('create posts...');
    items = items || [];
    let collection = db.collection('Post');
    items.forEach((item) => {
        let posts = collection.where({
            feed_url: item.feed_url,
            title: item.title
        }).get().then((res)=>{
            if(res && res.data && res.data.length){
                console.log('this post id exited.')
            }else{
                collection.add({
                    data: item,
                    success:(res)=>{
                        console.log('new post:',res);
                    }
                })
            }
        });
    })
}
