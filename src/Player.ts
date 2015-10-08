class Player extends egret.Sprite{
    private speed:number = 0;
    public vy:number = 10;
    public vx:number = 0;
    public constructor(){
        super();
        var body:egret.Bitmap = this.createBitmapByName('egretIcon');
        this.addChild(body);
        body.scaleX = 0.5;
        body.scaleY = 0.5;
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}