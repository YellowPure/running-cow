var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.speed = 0;
        this.vy = 10;
        this.vx = 0;
        var body = this.createBitmapByName('egretIcon');
        this.addChild(body);
        body.scaleX = 0.5;
        body.scaleY = 0.5;
    }
    var __egretProto__ = Player.prototype;
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
    return Player;
})(egret.Sprite);
Player.prototype.__class__ = "Player";
