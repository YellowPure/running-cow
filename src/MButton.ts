class MButton extends egret.Sprite{
    private desc;
    public constructor(_desc) {
        super();
        this.desc = _desc;
        this.init();
    }
    private init():void{
        var img:egret.Bitmap = new egret.Bitmap();
        img.texture = RES.getRes('buttonBg');
        var rec:egret.Rectangle = new egret.Rectangle(5,5,5,5);
        img.scale9Grid = rec;
        img.width = 54;
        img.height = 54;
        this.addChild(img);
        
        var txt:egret.TextField = new egret.TextField();
        txt.text = this.desc;
        txt.textColor = 0x999999;
        this.addChild(txt);
    }
}