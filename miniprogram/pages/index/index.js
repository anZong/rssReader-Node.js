// pages/index/index.js
import {Config} from '../../base/config.js';
const app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        feeds:null,
        showNewFeed:false,
        search_results:null,
        search_input:''
    },
    onShow(){
        if(app.globalData.openid){
            this.getFeeds();
        }else{
            app.login(() => {
                this.getFeeds();
            })
        }
    },
    showAdd(){
        this.setData({
            showNewFeed:true,
            refresh:false
        })
    },
    addFeed(e){
        let data = e.detail.value;
        let url = data.url;
        if(!url)return;
        this.setData({
            showNewFeed:false
        });
        try{
            let Feed = db.collection('Feed');
            Feed.where({
                url:url,
                _openid: app.globalData.openid
            }).get().then((res)=>{
                wx.navigateTo({
                    url: `/pages/post/list?url=${url}`,
                })
            })
        }catch(e){
            console.error(e);
        }
    },
    getFeeds(){
        let feeds = wx.getStorageSync('feeds');
        if(!this.data.refresh && !!feeds){
            this.setData({
                feeds
            })
        }else{
            app.B.doing('正在加载...');
            db.collection('Feed').orderBy('addTime','desc').where({
                _openid: app.globalData.openid
            }).get().then((res) => {
                app.B.done();
                this.setData({
                    feeds: res.data || [],
                    refresh:false
                })
                wx.stopPullDownRefresh();
                wx.setStorageSync('feeds', res.data)
            }, () => { app.B.done();})
        }
    },
    search(e){
        let kw = e.detail.value;
        if(!kw){
            this.setData({
                search_results: null
            })
            return;
        }
        let _this = this;
        app.B.doing('正在搜索...');
        db.collection('Feed').where({
            title:_.eq(kw)
        }).field({
            _id:true,
            title:true,
            url:true
        }).get().then((res)=>{
            app.B.done();
            if(res && res.data && res.data.length){
                _this.setData({
                    search_results: res.data
                })
            }
        })
    },
    addFeedFromSearch(e){
        let feed = e.currentTarget.dataset.item;
        let feeds = this.data.feeds;
        let ids = feeds.map((o)=>{
            return o._id
        })
        this.setData({
            search_results:null
        })
        if (ids.includes(feed._id)){
            app.B.toast('已经在列表中')
            return;
        }
        feeds.push(feed);
        this.setData({
            feeds:feeds
        })
        app.B.toast('添加成功')
    },
    closeSearch(){
        this.setData({
            search_results: null,
            search_input: ''
        })
    },
    hideNewFeed(){
        this.setData({
            showNewFeed:false
        })
    },
    gotoPosts(e){
        let dataset = e.currentTarget.dataset;
        let url = dataset.url;
        let title = dataset.title;
        wx.navigateTo({
            url: `/pages/post/list?url=${url}&title=${title}`
        })
    },
    delFeed(e){
        let dataset = e.currentTarget.dataset;
        let id = dataset.id;
        let _this = this;
        app.B.confirm('提示','是否删除此订阅?',(res)=>{
            if(res.confirm){
                db.collection('Feed').doc(id).remove().then(()=>{
                    app.B.toast('删除成功!');
                    _this.setData({
                        refresh:true
                    })
                    _this.getFeeds();
                },()=>{
                    app.B.toast('删除失败!','none');
                })
            }
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            refresh:true
        })
        this.getFeeds();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})