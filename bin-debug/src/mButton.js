var MButton = (function (_super) {
    __extends(MButton, _super);
    function MButton(_desc) {
        _super.call(this);
        this.desc = _desc;
        this.init();
    }
    var __egretProto__ = MButton.prototype;
    __egretProto__.init = function () {
        var img = new egret.Bitmap();
        img.texture = RES.getRes('buttonBg');
        var rec = new egret.Rectangle(5, 5, 5, 5);
        img.scale9Grid = rec;
        img.width = 54;
        img.height = 54;
        this.addChild(img);
        var txt = new egret.TextField();
        txt.text = this.desc;
        txt.textColor = 0x999999;
        this.addChild(txt);
    };
    return MButton;
})(egret.Sprite);
MButton.prototype.__class__ = "MButton";
