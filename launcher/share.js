window.share = {};
var log = getLogObj();
var locationOrigin = window.location.origin || location.protocol + '//' + location.host;
window.share.setting = {
    title: '股市向前冲_百度股市通',
    desc: '史上最炫酷的股市版跑酷游戏，你也来玩试试吧。',
    link: locationOrigin + '/activity/running/',
    imgUrl: locationOrigin + '/activity/running/resource/assets/share-icon.png',
    success: function() {
        // 用户确认分享后执行的回调函数
        log.shareToFriend();
    }
};
window.onload = function(){
    if (window.wx) {
        // 注册微信事件
        var wx = window.wx;
        wx.ready(function() {
            wx.onMenuShareTimeline(window.share.setting);
            wx.onMenuShareAppMessage(window.share.setting);
            wx.onMenuShareQQ(window.share.setting);
            wx.onMenuShareWeibo(window.share.setting);
        });
    }
}

function getLogObj() {
    var _hmt = _hmt || [];
    var init = function() {
        var hm = document.createElement('script');
        hm.src = '//hm.baidu.com/hm.js?35d1e71f4c913c126b8703586f1d2307';
        var s = document.getElementsByTagName('script')[0];
        hm.async = 'true';
        s.parentNode.insertBefore(hm, s);
    };
    init();

    var trackEvent = function(category, action) {
        action = action || 'tap';
        window['_hmt'].push([
            '_trackEvent',
            category,
            action
            ]);
    };
    return {
        shareToFriend: function() {
            trackEvent('huodong_running_share');
        },
        download: function() {
            trackEvent('huodong_running_download');
        }

    };
}