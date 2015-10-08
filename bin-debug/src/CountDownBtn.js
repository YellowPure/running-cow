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
        _texture = RES.getRes('power');
        _bit2.texture = _texture;
        this.bg = _bit2;
        var _bit = new egret.Bitmap();
        var _texture = RES.getRes('power_countdown');
        _bit.texture = _texture;
        this.countDownBg = _bit;
        this.addChild(_bit);
        this.addChild(_bit2);
        this.countDownBg.visible = false;
        this.powerTimer = new egret.Timer(3000, 1);
        this.powerTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerEnd, this);
        this.countDownTimer = new egret.Timer(10000, 1);
        this.countDownTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerOk, this);
    }
    var __egretProto__ = CountDown.prototype;
    __egretProto__.powerEnd = function (e) {
        this.countDownBg.visible = true;
        this.bg.visible = false;
        this.addSVGCountDown();
        var _custom = new CustomDispatcher(CustomDispatcher.POWER_END);
        this.dispatchEvent(_custom);
    };
    __egretProto__.powerOk = function (e) {
        this.bg.visible = true;
        this.countDownBg.visible = false;
        this.removeSVGCountDown();
        this.isCountDown = false;
    };
    __egretProto__.startCountDown = function () {
        this.powerTimer.start();
        this.isCountDown = true;
    };
    __egretProto__.removeSVGCountDown = function () {
        var svg = document.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg');
        if (svg) {
            document.body.removeChild(svg);
        }
    };
    __egretProto__.addSVGCountDown = function () {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');
        svg.setAttribute('viewbox', '0 0 100 100');
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '40');
        circle.setAttribute('stroke-width', '10');
        circle.setAttribute('stroke', "#db2900");
        circle.setAttribute('fill', 'none');
        svg.appendChild(g);
        g.appendChild(circle);
        document.body.appendChild(svg);
    };
    return CountDown;
})(egret.Sprite);
CountDown.prototype.__class__ = "CountDown";
