var EndGame = (function (_super) {
    __extends(EndGame, _super);
    function EndGame() {
        // code...
        _super.call(this);
        this.addEventListener('GAME_END', this.showPanel, this);
    }
    var __egretProto__ = EndGame.prototype;
    __egretProto__.showPanel = function (e) {
        console.log('game end', e);
    };
    return EndGame;
})(egret.Sprite);
EndGame.prototype.__class__ = "EndGame";
