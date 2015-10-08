var MBlock = (function () {
    function MBlock() {
        this.factor = 50;
        var _disp = new egret.Bitmap();
        var _t = RES.getRes('rect');
        _disp.texture = _t;
        _disp.anchorX = _disp.anchorY = .5;
        var _rect = new p2.Rectangle(_disp.width / this.factor, _disp.height / this.factor);
        var _blockBody = new p2.Body({
            mass: 1,
            position: [_disp.width / 2 / this.factor, _disp.height / 2 / this.factor],
            fixedRotation: true
        });
        this.blockBody = _blockBody;
        this.blockBody.displays = [_disp];
        this.blockBody.addShape(_rect);
    }
    var __egretProto__ = MBlock.prototype;
    return MBlock;
})();
MBlock.prototype.__class__ = "MBlock";
