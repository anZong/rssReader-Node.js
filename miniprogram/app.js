//app.js
import {B} from './base/base.js'
App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true
            })
        }
        this.globalData = {}
    },
    globalData: {
        userInfo: null,
        openid: null,
    },
    login(cbk) {
        wx.cloud.callFunction({
            name: 'login',
            data: {}
        }).then((res) => {
            this.globalData.openid = res.result.openid;
            cbk && cbk();
        })
    },
    B:B
})
