var Block = (function (_super) {
    __extends(Block, _super);
    function Block(name) {
        // code...
        _super.call(this);
        var bitmap = new egret.Bitmap();
        var texture = RES.getRes(name);
        bitmap.texture = texture;
        this.type = name;
        this.addChild(bitmap);
    }
    var __egretProto__ = Block.prototype;
    return Block;
})(egret.Sprite);
Block.prototype.__class__ = "Block";
