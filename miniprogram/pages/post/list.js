// pages/post/list.js
const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        posts:null,
        feed_url:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let feed_url = options.url;
        let title = options.title;
        this.setData({
            feed_url
        })
        if(title){
            wx.setNavigationBarTitle({
                title
            })
            this.getPosts(feed_url);
        }else{
            this.parseFeed(feed_url);
        }
        
    },
    parseFeed(url){
        app.B.doing('正在解析...');
        wx.cloud.callFunction({
            name:'parseFeed',
            data:{
                feed_url:url
            }
        }).then((res)=>{
            app.B.done();
            this.getPosts(url);
            wx.setNavigationBarTitle({
                title: res && res.result && res.result.title || '文章列表',
            })
            wx.stopPullDownRefresh();
        },()=>{app.B.done();})
    },
    getPosts(url){
        app.B.doing('正在获取文章...');
        db.collection('Post').orderBy('date','desc').where({
            feed_url:url
        }).field({
            _id: true,
            date: true,
            title: true
        }).get().then((res)=>{
            app.B.done();
            if(res.data.length){
                this.setData({
                    posts: res.data
                })
            }else{
                app.B.toast('暂无文章');
            }
        }, () => { app.B.done();})
    },
    gotoDetail(e){
        let post_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/post/detail?id=${post_id}`,
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let feed_url = this.data.feed_url;
        this.parseFeed(feed_url);
    }
})