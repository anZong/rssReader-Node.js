// pages/post/detail.js
const app = getApp();
let preTop = 0;
let images = [];
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        post: null,
        showTop: false,
        scrollTop:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let post_id = options.id;
        this.getPost(post_id);
    },
    getPost(id) {
        let _this = this;
        app.B.doing('正在加载...');
        db.collection('Post').doc(id).get().then((res)=>{
            app.B.done();
            if (res && res.data) {
                console.log(res)
                let post = res.data;
                post.content = post.content.replace(/\<img/gi, '<img class="image"');
                _this.getImages(post.content);
                _this.setData({
                    post: post
                })
            }
        },()=>{app.B.done()});
    },
    getImages(str){
        // let imgReg = /<img[^\>]*\/>/gi;
        let srcReg = /http:\/\/[\S]*\.(?:jpg|png|jpeg|gif|ico){1}/gi;
        images = str.match(srcReg);
    },
    scroll(e) {
        let top = e.detail.scrollTop;
        if(top%10) return;
        let show = false;
        if (top > 100) {   //滚动条大于等于100时显示 返回顶部
            show = true;
        } 
        this.setData({
            showTop: show
        })

    },
    toTop(){
        this.setData({
            scrollTop:0
        })
    },
    viewImages(){
        console.log(images);
        if(!images.length)return;
        wx.previewImage({
            urls: images,
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        
    }
})