// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

var parser =  require('./parser.js');
var dbop = require('./database.js');

// 云函数入口函数
exports.main = (event, context) => {
    console.log('event:',event);
    let feed_url = event.feed_url;
    let openid = event.userInfo.openId;
    return new Promise((resolve,reject)=>{
        parser.parseFeed(feed_url, (res) => {
            let posts = res.items.map((post)=>{
                return {
                    feed_url: feed_url,
                    title: post.title,
                    content: post.description,
                    date: post.date,
                    author: post.author
                }
            })
            dbop.updateFeed(feed_url,openid, res.meta);
            dbop.createPosts(posts);
            resolve();
        });
    })  
}
