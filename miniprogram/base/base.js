import { Config } from './config.js';
let B = {
    toast:(title, icon) => {
        wx.showToast({
            title: title || '',
            mask: true,
            icon: icon || 'success'
        })
    },
    confirm: (title, content, cbk, showCancel = true) => {
        wx.showModal({
            title: title || '提示',
            content: content || '',
            showCancel: showCancel,
            success: (res) => {
                cbk && cbk(res);
            }
        })
    },
    msg: (title, content, cbk) => {
        B.confirm(title, content, cbk, false)
    },
    doing: (title) => {
        wx.showLoading({
            title: title || '正在加载...',
        })
    },
    done: () => {
        wx.hideLoading();
    }
}

export {B}