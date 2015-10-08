var SoundManager = (function () {
    function SoundManager() {
        this.isPause = false;
        // code...
        var _s = RES.getRes('mJump');
        var _s1 = RES.getRes('mHit');
        var _s2 = RES.getRes('mDead');
        this.bgm = RES.getRes('bgm');
        this.bgm.type = egret.Sound.MUSIC;
        this.dic = new Array();
        this.dic.push({ "name": "jump", "value": _s });
        this.dic.push({ "name": "hit", "value": _s1 });
        this.dic.push({ "name": "dead", "value": _s2 });
    }
    var __egretProto__ = SoundManager.prototype;
    __egretProto__.playBg = function () {
        this.bgm.play(true);
    };
    __egretProto__.playEffect = function (name) {
        for (var i = 0; i < this.dic.length; i++) {
            var ele = this.dic[i];
            if (ele.name == name) {
                ele.value.play();
            }
        }
    };
    __egretProto__.stopEffect = function (name) {
    };
    __egretProto__.stopBg = function () {
        this.bgm.stop();
    };
    __egretProto__.pauseBg = function (bol) {
        if (bol) {
            this.bgm.pause();
            this.isPause = true;
        }
        else {
            this.bgm.resume();
            this.isPause = false;
        }
    };
    Object.defineProperty(SoundManager, "$i", {
        get: function () {
            if (this._i == null) {
                this._i = new SoundManager;
            }
            return this._i;
        },
        enumerable: true,
        configurable: true
    });
    return SoundManager;
})();
SoundManager.prototype.__class__ = "SoundManager";
