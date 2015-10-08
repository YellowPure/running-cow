/**
 * 音效管理对象
 * assets为音效存放的资源目录.针对没有放入json文件的处理，默认值为"resource/audio/",可针对需求自行更改;
 * 播放背景音乐 Music.play("bgmp3");需要在"resource/audio/"目录下存在bgmp3.mp3文件才可以正常播放;
 * 播放音效文件 Music.playEffect("e1");需要在"resource/audio/"目录下存在e1.mp3文件才可以正常播放;
 * 停止背景音播放 Music.stop();停止背景音乐播放
 * 停止音效播放 Music.stopEffect();
 * 背景音状态更改（本质实现的是音量从0-1之间的转变）Music.change();
 * 音效状态更改 Music.changeEffect();
 * @author Randscar 
 * **/
module Music {
    export class MP3data{
        /** 声音数据资源名称(外部只可获取)*/
        public resName: string;
                
        private _data: egret.Sound;
                
        private _volume: number=1;
        private _loop: number=0;
        private _isstop: boolean = false;
        private _isend: boolean = false;
        
        public isEnd():boolean{
            return this._isend;
        }
        /** 设置音量**/
        public setVolume(v:number):void{
            this._volume = v;
            if(this._data!=null)this._updateVolume();
        }
        
        public change():boolean{
            if(this._volume == 1) {
                this.setVolume(0);
                return false;
            }
            this.setVolume(1);
            return true;
        }
        /* loop:循环播放次数，默认为0，标识只播放一次**/
        public play(res:string,loops:number=0):void{
            this._loop = loops;
            if(this.resName!=res){
                this._isstop = false;
                this.resName = res;
                this._stop();
                this._data= RES.getRes(res);
                if(!this._play()){
                    RES.getResByUrl(assets+res+".mp3",this._loadComplete,this,RES.ResourceItem.TYPE_SOUND);
                }
            }else if(this._isend){
                this._play();
            }
        }
        /** 重现播放*/
        public replay():void{
            this._stop();
            this._isstop = false;
            this._play();
        }
        /** 停止播放*/
        public stop():void{
            this._isstop = true;
            this._isend = true;
            this._stop();
        }
        private _play():boolean{
            var r: any = this._data;
            this._isend = true;
            if(r != null&&r instanceof egret.Sound){
                r.play(true);
                r.addEventListener(egret.SoundEvent.SOUND_COMPLETE,this._playComplete,this);
                this._updateVolume();
                this._isend = false;
                return true;
            }else{
                this._data = null;
            }
            return false;
        }
        private _stop():void{
            var r: any = this._data;
            if(r != null){
                r.stop();
                r.removeEventListener(egret.SoundEvent.SOUND_COMPLETE,this._playComplete,this);
            }
        }
        private _loadComplete(data:any,url:string):void{
            var s: string = this.resName;
            s = assets + s + ".mp3";
            if(s==url){
                this._data = data;
                if(!this._isstop)this._play();
            }
        }
        private _playComplete():void{
            if(this._loop < 0||this._loop>0) {
                //this._stop();
                //this._play();
                if(this._loop>0)this._loop = this._loop - 1;
            }else{
                this._isend = true;
                this._stop();
            }
        }
        private _updateVolume():void{
            //底层实现有时会报错 此处打印出来。方便查看
            try{
                this._data.volume = this._volume;
            }catch(e){
                console.log("Music:"+this.resName+" set volume=" + this._volume + " error! " + e);
            }
        }
    }
    /** mp3存放文件资源目录*/
    export var assets: string = "resource/assets/";
    /** 音效数据**/
    export var __mp3: Object = {};
    export var __bg: MP3data = new MP3data();
    export var __volumeEffect: number = 1;
	/** 播放背景音乐*/
    export function play(resName:string):void{
        __bg.play(resName,-1);
    }
    /** 暂停背景音乐的播放(正在加载的背景无效。)*/
    export function stop():void{
        __bg.stop();
    }
    /** 设置背景音量*/
    export function setVolume(v:number):void{
        __bg.setVolume(v);
    }
    /** 播放音效*/
    export function playEffect(resName:string):void{
        var r: MP3data = __mp3[resName];
        if(r==null){
            r = new MP3data();
            __mp3[resName] = r;
            r.play(resName,0);
            r.setVolume(__volumeEffect);
        }else if(r.isEnd()){
            r.replay();
        }
    }
    /** 停止全部音效**/
    export function stopEffect():void{
        for(var t in __mp3){
            var s: MP3data= __mp3[t];
            s.stop();
        }
    }
    /** 设置音效音量*/
    export function setEffectVolumn(v:number):void{
        __volumeEffect = v;
        for(var t in __mp3){
            var s: MP3data= __mp3[t];
            s.setVolume(v);
        }
    }
    /** 更改背景音乐的状态(实质是修改音量为0)*/
    export function change(): boolean {
        return __bg.change();
    }
    /** 更改音效状态,实质是修改音效为0**/
    export function changeEffect():boolean{
        if(__volumeEffect == 1) {
            setEffectVolumn(0);
            return false;
        }
        setEffectVolumn(1);
        return true;
    }
}
