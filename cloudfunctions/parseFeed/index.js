// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

let parser =  require('./parser.js');
let dbop = require('./dbdata.js');

// 云函数入口函数
exports.main = async (event, context) => {
    let feed_url = event.feed_url;
    let openid = event.userInfo.openId;
    try{
        return new Promise((resolve, reject) => {
            parser.parseFeed(feed_url, (res) => {
                let posts = res.items.map((post) => {
                    return {
                        feed_url: feed_url,
                        title: post.title,
                        content: post.description,
                        date: post.date,
                        author: post.author
                    }
                })
                if (!res.meta.pubdate) {
                    res.meta.pubdate = posts[0].date;
                }
                console.log('meta:', res.meta);
                dbop.updateFeed(db, feed_url, openid, res.meta)
                    .then((feed) => {
                        if (feed.need_update) {
                            dbop.createPosts(db, posts).then((post) => {
                                resolve({
                                    'title': res.meta.title,
                                    '_id': feed._id,
                                    'is_new': feed.is_new
                                })
                            })
                        }
                    })
            });
        })
    }catch(e){
        console.log(e)
    }
}
