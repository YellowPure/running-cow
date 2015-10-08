class SoundManager {
    
    private static _i:SoundManager;
    private bgm: egret.Sound;
    private dic: Array<any>;
    public isPause: boolean = false;
    constructor() {
        // code...
        var _s = RES.getRes('mJump');
        var _s1 = RES.getRes('mHit');
        var _s2 = RES.getRes('mDead');
        this.bgm = RES.getRes('bgm');
        this.bgm.type = egret.Sound.MUSIC;
        this.dic = new Array();
        this.dic.push({"name":"jump","value":_s});
        this.dic.push({"name":"hit","value":_s1});
        this.dic.push({"name":"dead","value":_s2});
    }
    public playBg():void{
        this.bgm.play(true);
    }
    public playEffect(name:string):void{
        for (var i = 0; i < this.dic.length;i++){
            var ele = this.dic[i];
            if(ele.name == name){
                ele.value.play();
            }
        }
    }
    public stopEffect(name:string):void{

    }
    public stopBg():void{
        this.bgm.stop();
    }
    public pauseBg(bol:boolean):void{
        if(bol){
            this.bgm.pause();
            this.isPause = true;
        }else{
            this.bgm.resume();
            this.isPause = false;
        }
    }

    public static get $i():SoundManager{
        if( this._i == null ){
            this._i = new SoundManager;
        }
        return this._i;
    }
}