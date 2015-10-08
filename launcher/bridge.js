/**
 * @file 股市通H5与app交互接口
 * @author shangshichao(shangshichao01@baidu.com)
 * @module base/bridge
 */
(function () {
    var exports = {};
    var ua = navigator.userAgent;
    var util = {};
    util.platform = /android/i.test(ua) ? 'android' : (/ OS .* Mac/i.test(ua) ? 'ios' : '');
    exports.platform = util.platform;
    util.urlParam = function (obj) {
        var encode = encodeURIComponent;
        var k;
        var arr = [];
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                arr.push(encode(k) + '=' + encode(obj[k] || ''));
            }
        }
        return arr.join('&');
    };

    var callbackIndex = 0;
    var appVer = 0;

    /**
     * 拼装android字符串
     * @private
     * @param {string} method 方法名
     * @param {Array} argsArr 参数数组
     * @callback {Function} callback  回调函数
     */
    var buildAndroidCall = function (method, argsArr, callback) {
        if (!method) {
            return;
        }
        if (!argsArr) {
            argsArr = [];
        }
        if (!callback) {
            callback = '';
        }
        return method + '|' + argsArr.join(',') + '|' + callback;
    };

    /**
     * 调用安卓方法
     * @param {string} method 方法名
     * @param {Array} argsArr 参数数组
     * @param {callback} callback  回调函数
     */
    var callAndroid = function (method, argsArr, callback) {
        window.prompt(buildAndroidCall(method, argsArr, callback));
    };

    /**
     * 调用IOS方法
     * @param {string} method 方法名
     * @param {Array} argsArr 参数数组
     * @param {Function} callback 回调函数
     */
    var createIframe = function () {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        return iframe;
    };

    /**
     * 调用端内方法
     * @param {string} method 方法名
     * @param {Array} argsArr 参数数组
     * @param {Function} callback 回调函数
     */
    exports.call = function (method, argsArr, callback) {
        var iframe;
        var callbackName;
        argsArr = argsArr || [];
        if (util.platform === 'android') {
            callbackName = 'gushitongAndroidCallback' + callbackIndex++;
            window[callbackName] = function () {
                callback && callback.apply(null, arguments);
                window[callbackName] = null;
            };
            callAndroid(method, argsArr, callbackName);
        }
        else {
            if (util.platform === 'ios') {
                callbackName = 'gushitongIOSCallback' + callbackIndex++;
                iframe = createIframe();
                window[callbackName] = function () {
                    callback && callback.apply(null, arguments);
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }
                    window[callbackName] = null;
                };
                var src = '';
                if (argsArr.length > 0) {
                    src = method + ':' + argsArr.join(':') + ':' + callbackName;
                }
                else {
                    src = method + ':' + callbackName;
                }
                iframe.src = src;
            }
        }

    };

    var call = exports.call;

    var newCall = function (method, args, callback) {
        var argsStr = JSON.stringify(args);
        var iframe;
        var callbackName;
        var para;
        var callStr;
        if (util.platform === 'android') {
            callbackName = 'gushitongAndroidCallback' + callbackIndex++;
            window[callbackName] = function () {
                callback && callback.apply(null, arguments);
                window[callbackName] = null;
            };
        }
        else {
            if (util.platform === 'ios') {
                callbackName = 'gushitongIOSCallback' + callbackIndex++;
                iframe = createIframe();
                window[callbackName] = function () {
                    callback && callback.apply(null, arguments);
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }
                    window[callbackName] = null;
                };
            }
        }
        para = {
            method: method,
            args: argsStr,
            callback: callbackName

        };
        callStr = util.urlParam(para);
        // alert(callStr);
        if (util.platform === 'android') {
            window.prompt(callStr);
        }
        else {
            iframe.src = 'callmethod://method?' + callStr;
        // alert(iframe.src);
        }

    };


    /**
     * 打开没有后退的新页面 (for android)
     * @param {string} url 页面url
     * @param {string} title 页面标题
     * @param {number} showprize 1:显示奖品按钮 0:不显示
     * @param {number} showrefresh 1:显示刷新按钮 0:不显示
     * @param {Function} callback 错误处理函数
     */
    exports.linkontop = function (url, title, showprize, showrefresh, error) {
        try {
            call('linkontop', [
                encodeURIComponent(url),
                encodeURIComponent(title || ''),
                showprize || 0,
                showrefresh || 0
            ]);
        }
        catch (e) {
            error && error(e);
        }
    };

    /**
     * 打开可以后退的新页面 (for android)
     * @param {string} url 页面url
     * @param {string} title 页面标题
     * @param {number} showprize 1:显示奖品按钮 0:不显示
     * @param {number} showrefresh 1:显示刷新按钮 0:不显示
     * @param {Function} callback 错误处理函数
     */
    exports.linkInner = function (url, title, showprize, showrefresh, error) {
        try {
            call('linkinner', [
                encodeURIComponent(url),
                encodeURIComponent(title || ''),
                showprize || 0,
                showrefresh || 0
            ]);
        }
        catch (e) {
            error && error(e);
        }
    };

    /**
     * 打开新页面
     * @param {string} url 页面url
     * @param {string} title 页面标题
     * @param {Function} error 错误处理函数
     */
    exports.link = function (url, title, error) {
        var iframe;
        try {
            if (util.platform === 'android') {
                call('link', [
                    encodeURIComponent(url),
                    encodeURIComponent(title)
                ]);
            }
            else {
                if (util.platform === 'ios') {
                    iframe = createIframe();
                    iframe.src = 'bdstock://?openurl=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
                }
            }
        }
        catch (e) {
            error && error(e);
        }
    };

    /**
     * 打开端内个股详情页
     * @param {string} code 股票代码 不包含交易所前缀
     * @param {string} name 股票名称
     * @param {string} exchange 交易所 例如:sh
     */
    exports.linkstock = function (code, name, exchange) {
        var iframe;
        if (util.platform === 'android') {
            call('linkstock', [
                code,
                name,
                exchange,
                '0'
            ]);
        }
        else {
            if (util.platform === 'ios') {
                iframe = createIframe();
                iframe.src = 'detail://stock?exchange=' + encodeURIComponent(exchange) + '&code=' + encodeURIComponent(code) + '&name=' + encodeURIComponent(name);
            }
        }
    };

    if (util.platform === 'android') {

        /**
         * 获取bdussId (android 2.2之前可用)
         * @param {Function} callback 回调函数
         */
        exports.getBdussId = function (callback) {
            call('getBdussId', [], function (bduss) {
                callback && callback(bduss);
            });
        };

        /**
         * 获取Uid
         * @param {Function} callback 回调函数
         */
        exports.getUid = function (callback) {
            call('getUid', [], function (uid) {
                callback && callback(uid);
            });
        };

        /**
         * 获取用户名
         * @param {Function} callback 回调函数
         */
        exports.getUserName = function (callback) {
            call('getUsername', [], function (username) {
                callback && callback(username);
            });
        };

        /**
         * 跳转到炒股大赛
         * @param {string} url 调起炒股大赛的地址
         */
        exports.toMatch = function (url) {
            call('toMatch', [
                url
            ]);
        };
    }

    exports.getVersion = function (callback) {
        callback && callback(appVer);
    };

    exports.invoke = newCall;

    /**
     * 获取加密后的 (2.2之后可用)
     * @param {Function} callback 回调函数
     */
    exports.getEncryptedBDUSS = function (callback) {
        newCall('getEncryptedBDUSS', {}, function (encryptedBDUSS) {
            callback && callback(encryptedBDUSS);
        });
    };

    /**
     * 获取加密后Uid(2.2之后可用)
     * @param {Function} callback 回调函数
     */
    exports.getEncryptedUid = function (callback) {
        newCall('getEncryptedUid', {}, function (encryptedUid) {
            callback && callback(encryptedUid);
        });
    };

    /**
     * 获取Uid
     * @param {Function} callback 回调函数
     */
    exports.getUid = function (callback) {
        newCall('getUid', {}, function (uid) {
            callback && callback(uid);
        });
    };

    /**
     * 获取用户名
     * @param {Function} callback 回调函数
     */
    exports.getUserName = function (callback) {
        newCall('getUserName', {}, function (username) {
            callback && callback(username);
        });
    };

    /**
     * 打开特殊分享信息的页面
     * @param {Object} params 参数
     * @param {string} params.shareTitle 分享的标题
     * @param {string} params.shareUrl 分享的url
     * @param {string} params.url 打开页面的url
     * @param {Function} callback 回调
     */
    exports.openPageWithSpecialShareInfo = function (params, callback) {
        newCall('openPageWithSpecialShareInfo', params, function () {});
    };

    /**
     * 打开端内页面
     * @param {Object} args 参数对象
     * @param {Function} callback 回调函数
     */
    exports.callNativePage = function (args, callback) {
        newCall('callNativePage', args, callback);
    };

    /**
     * 调用端内分享功能
     *
     * @param {string} url 分享的url
     * @param {string} title 分享的标题
     * @param {Function} callback 回调函数
     */
    exports.share = function (url, title, callback) {
        newCall('share', {
            url: url,
            title: title

        }, callback);
    };

    /**
     * 获取app版本号
     *
     * @param {Function} callback 回调函数
     */
    exports.getVersion = function (callback) {
        newCall('getVersion', '', callback);
    };
    var urlParse = function (querystr) {
        var i;
        var n;
        var arr = querystr.split('&');
        var obj = {};
        var tmp;
        var decode = decodeURIComponent
        for (i = 0, n = arr.length; i < n; i++) {
            tmp = arr[i].split('=')
            obj[decode(tmp[0])] = decode(tmp[1])
        }
        return obj;
    };
    exports.urlQueryParams = function () {
        return urlParse(location.search.replace(/^\?/, ''));
    };
    window.bridge = exports;
    return exports;
})();
