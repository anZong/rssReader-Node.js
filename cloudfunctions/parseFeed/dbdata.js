exports.updateFeed = (db,feed_url, openid, meta) => {
    console.log('check feed...');
    let clt = db.collection('Feed');
    return new Promise((resolve,reject)=>{
        clt.where({
            url: feed_url
        })
        .field({
            _id: true,
            pubdate: true
        })
        .get()
        .then((feed) => {
            if (feed.data.length) {
                console.log('this feed is exited.');
                resolve({
                    need_update: feed.data[0].pubdate != meta.pubdate,
                    _id: feed.data[0]._id,
                    is_new:false
                })
            } else {
                clt.add({
                    data: {
                        title: meta.title || '',
                        _openid: openid,
                        addTime: new Date(),
                        pubdate: meta.pubdate || new Date(),
                        url: feed_url
                    }
                })
                .then((res) => {
                    console.log('new feed:', res);
                    resolve({
                        need_update:true,
                        _id: res._id,
                        is_new: true
                    })
                },(err)=>{
                    console.log(err);
                    reject(err)
                })
            }
        },(err)=>{
            console.log(err);
            reject(err)
        })
    })
    
}

exports.createPosts = (db,items) => {
    console.log('create posts...');
    let clt = db.collection('Post');
    let results = [];
    for (var i in items) {
        let item = items[i];
        let result = new Promise((resolve,reject)=>{
            try{
                clt.where({
                    feed_url: item.feed_url,
                    title: item.title
                }).get()
                .then((res) => {
                    if (res.data.length) {
                        resolve(res.data[0])
                    }else{
                        clt.add({
                            data: item
                        }).then((res)=>{
                            resolve(res._id)
                        })
                    }
                })
            }catch(e){
                console.log(e);
                resolve()
            } 
        })
        results.push(result);
    }
    return Promise.all(results)
}