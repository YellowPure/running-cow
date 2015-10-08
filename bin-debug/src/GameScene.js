var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this.init();
    }
    var __egretProto__ = GameScene.prototype;
    __egretProto__.init = function () {
        this.gameMainView = new GameMain();
        this.addChild(this.gameMainView);
    };
    return GameScene;
})(egret.Sprite);
GameScene.prototype.__class__ = "GameScene";
