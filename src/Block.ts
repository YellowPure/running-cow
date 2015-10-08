class Block extends egret.Sprite {
    public type:string;
    /**
     * 障碍物类型
     * @type 1普通障碍物 2 不可碰撞障碍物 
     */
    public blockType: number;
    public constructor(name) {
        // code...
        super();
        var bitmap: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        bitmap.texture = texture;
        this.type = name;
        this.addChild(bitmap);
    }
}