var CountDown = (function (_super) {
    __extends(CountDown, _super);
    function CountDown() {
        _super.call(this);
        /**
         * 是否正在冷却中
         * @type {boolean}
         */
        this.isCountDown = false;
        var _bit2 = new egret.Bitmap();
        var _texture = RES.getRes('power');
        _bit2.texture = _texture;
        this.bg = _bit2;
        this.addChild(_bit2);
        this.powerTimer = new egret.Timer(3000, 1);
        this.powerTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerEnd, this);
        this.countDownTimer = new egret.Timer(10500, 1);
        this.countDownTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerOk, this);
        var data = RES.getRes('countdown_json');
        var texture = RES.getRes('countdown_gif');
        var mcDataFactory = new egret.MovieClipDataFactory(data, texture);
        var _b = new egret.MovieClip(mcDataFactory.generateMovieClipData());
        _b.x = 18;
        _b.y = 18;
        _b.frameRate = .3;
        _b.stop();
        // _b.gotoAndPlay('run',-1);
        _b.visible = false;
        this.addChild(_b);
        var _mask = new egret.Shape();
        _mask.graphics.beginFill(0xff0000, 1);
        _mask.graphics.drawRect(0, 0, 100, 80);
        _mask.x = -30;
        _mask.y = 8;
        _mask.alpha = 0;
        this.addChild(_mask);
        this.countDownBtn = _b;
        // var svgBox = document.createElement('div');
        // svgBox.id = 'svgBox';
        // document.body.appendChild(svgBox);
        // svgBox.style.display = 'none';
    }
    var __egretProto__ = CountDown.prototype;
    __egretProto__.powerEnd = function (e) {
        this.countDownBtn.visible = true;
        this.countDownBtn.gotoAndPlay('run', -1);
        this.bg.visible = false;
        var _custom = new CustomDispatcher(CustomDispatcher.POWER_END);
        this.dispatchEvent(_custom);
        console.log('powerEnd');
    };
    __egretProto__.powerOk = function (e) {
        this.countDownOk();
    };
    __egretProto__.countDownOk = function () {
        this.bg.visible = true;
        this.countDownBtn.visible = false;
        this.countDownBtn.stop();
        this.isCountDown = false;
        console.log('countdown finish');
    };
    __egretProto__.startCountDown = function () {
        this.powerTimer.start();
        this.countDownTimer.start();
        this.isCountDown = true;
    };
    return CountDown;
})(egret.Sprite);
CountDown.prototype.__class__ = "CountDown";
