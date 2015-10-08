var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        _super.call(this);
        this.init();
    }
    var __egretProto__ = Background.prototype;
    __egretProto__.init = function () {
        var sky = this.createBitmapByName("bg");
        this.addChild(sky);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Background;
})(egret.Sprite);
Background.prototype.__class__ = "Background";
