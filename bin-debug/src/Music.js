/**
 * 音效管理对象
 * assets为音效存放的资源目录.针对没有放入json文件的处理，默认值为"resource/audio/",可针对需求自行更改;
 * 播放背景音乐 Music.play("bgmp3");需要在"resource/audio/"目录下存在bgmp3.mp3文件才可以正常播放;
 * 播放音效文件 Music.playEffect("e1");需要在"resource/audio/"目录下存在e1.mp3文件才可以正常播放;
 * 停止背景音播放 Music.stop();停止背景音乐播放
 * 停止音效播放 Music.stopEffect();
 * 背景音状态更改（本质实现的是音量从0-1之间的转变）Music.change();
 * 音效状态更改 Music.changeEffect();
 * @author Randscar
 * **/
var Music;
(function (Music) {
    var MP3data = (function () {
        function MP3data() {
            this._volume = 1;
            this._loop = 0;
            this._isstop = false;
            this._isend = false;
        }
        var __egretProto__ = MP3data.prototype;
        __egretProto__.isEnd = function () {
            return this._isend;
        };
        /** 设置音量**/
        __egretProto__.setVolume = function (v) {
            this._volume = v;
            if (this._data != null)
                this._updateVolume();
        };
        __egretProto__.change = function () {
            if (this._volume == 1) {
                this.setVolume(0);
                return false;
            }
            this.setVolume(1);
            return true;
        };
        /* loop:循环播放次数，默认为0，标识只播放一次**/
        __egretProto__.play = function (res, loops) {
            if (loops === void 0) { loops = 0; }
            this._loop = loops;
            if (this.resName != res) {
                this._isstop = false;
                this.resName = res;
                this._stop();
                this._data = RES.getRes(res);
                if (!this._play()) {
                    RES.getResByUrl(Music.assets + res + ".mp3", this._loadComplete, this, RES.ResourceItem.TYPE_SOUND);
                }
            }
            else if (this._isend) {
                this._play();
            }
        };
        /** 重现播放*/
        __egretProto__.replay = function () {
            this._stop();
            this._isstop = false;
            this._play();
        };
        /** 停止播放*/
        __egretProto__.stop = function () {
            this._isstop = true;
            this._isend = true;
            this._stop();
        };
        __egretProto__._play = function () {
            var r = this._data;
            this._isend = true;
            if (r != null && r instanceof egret.Sound) {
                r.play(true);
                r.addEventListener(egret.SoundEvent.SOUND_COMPLETE, this._playComplete, this);
                this._updateVolume();
                this._isend = false;
                return true;
            }
            else {
                this._data = null;
            }
            return false;
        };
        __egretProto__._stop = function () {
            var r = this._data;
            if (r != null) {
                r.stop();
                r.removeEventListener(egret.SoundEvent.SOUND_COMPLETE, this._playComplete, this);
            }
        };
        __egretProto__._loadComplete = function (data, url) {
            var s = this.resName;
            s = Music.assets + s + ".mp3";
            if (s == url) {
                this._data = data;
                if (!this._isstop)
                    this._play();
            }
        };
        __egretProto__._playComplete = function () {
            if (this._loop < 0 || this._loop > 0) {
                //this._stop();
                //this._play();
                if (this._loop > 0)
                    this._loop = this._loop - 1;
            }
            else {
                this._isend = true;
                this._stop();
            }
        };
        __egretProto__._updateVolume = function () {
            try {
                this._data.volume = this._volume;
            }
            catch (e) {
                console.log("Music:" + this.resName + " set volume=" + this._volume + " error! " + e);
            }
        };
        return MP3data;
    })();
    Music.MP3data = MP3data;
    MP3data.prototype.__class__ = "Music.MP3data";
    /** mp3存放文件资源目录*/
    Music.assets = "resource/assets/";
    /** 音效数据**/
    Music.__mp3 = {};
    Music.__bg = new MP3data();
    Music.__volumeEffect = 1;
    /** 播放背景音乐*/
    function play(resName) {
        Music.__bg.play(resName, -1);
    }
    Music.play = play;
    /** 暂停背景音乐的播放(正在加载的背景无效。)*/
    function stop() {
        Music.__bg.stop();
    }
    Music.stop = stop;
    /** 设置背景音量*/
    function setVolume(v) {
        Music.__bg.setVolume(v);
    }
    Music.setVolume = setVolume;
    /** 播放音效*/
    function playEffect(resName) {
        var r = Music.__mp3[resName];
        if (r == null) {
            r = new MP3data();
            Music.__mp3[resName] = r;
            r.play(resName, 0);
            r.setVolume(Music.__volumeEffect);
        }
        else if (r.isEnd()) {
            r.replay();
        }
    }
    Music.playEffect = playEffect;
    /** 停止全部音效**/
    function stopEffect() {
        for (var t in Music.__mp3) {
            var s = Music.__mp3[t];
            s.stop();
        }
    }
    Music.stopEffect = stopEffect;
    /** 设置音效音量*/
    function setEffectVolumn(v) {
        Music.__volumeEffect = v;
        for (var t in Music.__mp3) {
            var s = Music.__mp3[t];
            s.setVolume(v);
        }
    }
    Music.setEffectVolumn = setEffectVolumn;
    /** 更改背景音乐的状态(实质是修改音量为0)*/
    function change() {
        return Music.__bg.change();
    }
    Music.change = change;
    /** 更改音效状态,实质是修改音效为0**/
    function changeEffect() {
        if (Music.__volumeEffect == 1) {
            setEffectVolumn(0);
            return false;
        }
        setEffectVolumn(1);
        return true;
    }
    Music.changeEffect = changeEffect;
})(Music || (Music = {}));
