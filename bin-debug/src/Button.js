var Button = (function (_super) {
    __extends(Button, _super);
    function Button(_text) {
        _super.call(this);
        this.text = _text;
        this.init();
    }
    var __egretProto__ = Button.prototype;
    __egretProto__.init = function () {
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x333333, 1);
        sp.graphics.drawCircle(0, 0, 50);
        sp.graphics.endFill();
        this.addChild(sp);
        var txt = new egret.TextField();
        txt.text = this.text;
        this.addChild(txt);
    };
    return Button;
})(egret.Sprite);
Button.prototype.__class__ = "Button";
