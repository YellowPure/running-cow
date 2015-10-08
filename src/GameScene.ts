class GameScene extends egret.Sprite {

    private gameMainView: GameMain;
    public constructor() {
        super();
        this.init();
    }
    private init(): void {
        this.gameMainView = new GameMain();
        this.addChild(this.gameMainView);
    }
}