// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = (event, context) => {
    return new Promise(async (resolve,reject)=>{
        let feed = await db.collection('Feed').get();
        console.log(feed);
        let site = await db.collection('Site').get();
        console.log(site);
        resolve({
            feed, site
        })
    })
}