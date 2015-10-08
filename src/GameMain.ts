interface Window { share: any;}
interface Window { wx: any;}
interface Window { log: any;}
interface Window { bridge: any;}
class GameMain extends egret.Sprite {
    
    private cow: egret.MovieClip;
    private bg: Background;
    private wStage: egret.Stage;
    private jumpBtn: egret.Sprite;
    private powerBtn: CountDown;
    /**
     * 牛的x轴速度
     * @type {number}
     */
    private COW_VX:number = 5;
    /**
     * 重力加速度
     * @type {number}
     */
    private GRAVITY:number = 10;
    /**
     * 牛初始y坐标
     * @type {number}
     */
    private COW_START_Y: number;
    private isJump: boolean;
    /**
     * 牛的y轴速度
     * @type {number}
     */
    private speedY: number = 0;
    private bgArr: Array<Background>;
    private blockArr: Array<Block>;
    /**
     * 无敌是否开启
     * @type {boolean}
     */
    private isPower: boolean = false;
    /**
     * 显示障碍物容器
     * @type {Array<Block>}
     */
    private showedBlockDictory: Array<Block>;
    private powerTimer: egret.Timer;
    /**
     * 记录背景移动距离
     * @type {number}
     */
    private rx: number;
    /**
     * 无敌牛容器
     * @type {egret.Sprite}
     */
    private power_cow: egret.Sprite;
    private cloudSp: egret.Bitmap;
    /**
     * 游戏状态
     * @type {string}
     */
    private GAME_STATE: string;
    private score: number;
    private scoreTxt:egret.TextField;
    private resultTxt: egret.TextField;
    private soundBox: egret.Sprite;
    private bgmPlaying: boolean = true;
    private failCow: egret.Bitmap;
    /**
     * 游戏结束面板
     */
    private endPanel: egret.Sprite;
    private transformX: number;
    private transformY: number;
    public constructor() {
        super();
        this.wStage = egret.MainContext.instance.stage;
        this.rx = this.wStage.stageHeight;
        // 初始化 背景
        this.initBg();
        // 初始化云
        this.initCloud();
        // 初始化 坑和熊 树 广告牌
        this.initBlock();
        // 初始化 牛
        this.initCow();
        // 初始化 ui
        this.initUIView();

        this.showedBlockDictory = [];
        this.startGame();
        // egret.Ticker.getInstance().register( this.run, this);
        this.GAME_STATE = "start";
        // this.transformX = this.wStage.stageHeight;
        // this.transformY = this.wStage.stageWidth;
        this.initEndPanel();
        // this.showEndPanel();
    }

    private startGame():void{
        var that = this;
        var num: number = 3;
        var tips: egret.Sprite = new egret.Sprite();
        var para = window.bridge.urlQueryParams();
        tips.x = this.wStage.stageHeight / 2 - 90;
        tips.y = this.wStage.stageWidth / 2 - 30;
        this.addChild(tips);
        var cTxt: egret.TextField =new  egret.TextField();
        cTxt.text = num.toString();
        cTxt.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        tips.addChild(cTxt);
        cTxt.textAlign = "center";
        cTxt.anchorX = cTxt.anchorY = .5;
        cTxt.x = 75;
        var tipsTxt: egret.TextField = new egret.TextField();
        tipsTxt.text = '横屏体验更佳哦';
        tipsTxt.size = 16;
        tipsTxt.textColor = 0x005dae;
        tipsTxt.x = 30;
        tipsTxt.fontFamily = cTxt.fontFamily;
        var tipsIcon: egret.Bitmap = new egret.Bitmap(RES.getRes('tips'));
        tipsTxt.y = 40;
        tipsIcon.y = 37;
        tips.addChild(tipsIcon);
        tips.addChild(tipsTxt);

        
        if(this.bgmPlaying == true){
            // SoundManager.$i.playBg();
            //if ((para['from'] == 'bdstockapp') && (window.bridge.platform == 'android')) {
            //}else{
                Music.play('bgm');
            //}
        }
        var t: egret.Timer = new egret.Timer(1000, 3);
        t.start();
        t.addEventListener(egret.TimerEvent.TIMER,function(e:egret.TimerEvent):void{
            cTxt.text = num.toString();
            cTxt.alpha = 1;
            if(num<=0) {
                cTxt.text = 'Go!';
            }
            var tw = egret.Tween.get(cTxt);
            tw.to({ scaleX: 2 ,scaleY:2}, 500)
            .to({scaleX:.5,scaleY:.5,alpha:0},500).call(function(){
                if(num<=0){
                    that.removeChild(tips);
                    that.GAME_STATE = 'ing';
                    egret.Ticker.getInstance().register( that.run, that);
                }
            }); 
            num--;
        },this);
        
    }

    private initCloud():void{
        this.cloudSp = new egret.Bitmap();
        var t: egret.Texture = RES.getRes('cloud');
        this.cloudSp.texture = t;
        this.addChild(this.cloudSp);
    }

    private initUIView():void{
        this.jumpBtn = new egret.Sprite();
        var _bitmap: egret.Bitmap = new egret.Bitmap();
        var _texture: egret.Texture = RES.getRes('jump');
        var para = window.bridge.urlQueryParams();
        _bitmap.texture = _texture;
        this.jumpBtn.addChild(_bitmap);
        this.addChild(this.jumpBtn);
        this.jumpBtn.x = this.wStage.stageHeight - 100;
        this.jumpBtn.y = this.wStage.stageWidth - 70;
        this.jumpBtn.touchEnabled = true;
        var _mask: egret.Shape = new egret.Shape();
        _mask.graphics.beginFill(0xff0000, 1);
        _mask.graphics.drawRect(0, 0, 100, 80);
        _mask.graphics.endFill();
        _mask.touchEnabled = true;
        _mask.x = -10;
        _mask.y = -10;
        _mask.alpha = 0;
        this.jumpBtn.addChild(_mask);
        // console.log('jumpbtn',this.jumpBtn.width, this.jumpBtn.height);

        this.powerBtn = new CountDown();
        // var _bit2:egret.Bitmap = new egret.Bitmap();
        // _texture = RES.getRes('power');
        // _bit2.texture = _texture;
        // this.powerBtn.addChild(_bit2);
        this.addChild(this.powerBtn);
        this.powerBtn.x = this.wStage.stageHeight - 200;
        this.powerBtn.y = this.wStage.stageWidth - 88;
        this.powerBtn.touchEnabled = true;
        this.powerBtn.addEventListener(CustomDispatcher.POWER_END, this.powerTimerComplete, this);
        this.powerBtn.addEventListener(CustomDispatcher.POWER_COUNTDOWN, this.powerOk, this);

        // this.powerTimer = new egret.Timer(3000, 1);
        // this.powerTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerTimerComplete, this);

        this.jumpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jump, this);
        this.powerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.power, this);

        this.scoreTxt = new egret.TextField();
        this.scoreTxt.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        this.score = 0;
        this.scoreTxt.text = this.score + '点';
        this.scoreTxt.x = this.wStage.stageHeight - 110;
        this.scoreTxt.size = 16;
        this.scoreTxt.y = 35;
        this.scoreTxt.textColor = 0x005dae;
        this.scoreTxt.textAlign = "right";
        this.addChild(this.scoreTxt);

        this.resultTxt = new egret.TextField();
        this.resultTxt.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        this.resultTxt.visible = false;
        this.resultTxt.width = 360;
        this.resultTxt.x = this.wStage.stageHeight/2 - this.resultTxt.width/2;
        
        this.resultTxt.y = this.wStage.stageWidth / 2 - 30;
        this.resultTxt.textColor = 0x000000;
        this.addChild(this.resultTxt);
        this.soundBox = new egret.Sprite();
        //if ((para['from'] == 'bdstockapp') && (window.bridge.platform == 'android')) {
        //}else{

            this.soundBox.x = this.wStage.stageHeight - 42;
            this.soundBox.y = 35;
            this.soundBox.touchEnabled = true;
            var soundOn:egret.Bitmap = new egret.Bitmap(RES.getRes('sound_on'));
            var soundOff:egret.Bitmap = new egret.Bitmap(RES.getRes('sound_off'));
            soundOff.visible = false;
            this.soundBox.addChild(soundOn);
            this.soundBox.addChild(soundOff);
            this.addChild(this.soundBox);
            this.soundBox.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOrOffBGM, this);
        //}
    }

    private onOrOffBGM(e:egret.TouchEvent):void{
        if(this.bgmPlaying){
            this.soundBox.getChildAt(0).visible = false;
            this.soundBox.getChildAt(1).visible = true;
            this.bgmPlaying = false;
            Music.stop();
            // SoundManager.$i.pauseBg(true);
        }else{
            this.soundBox.getChildAt(0).visible = true;
            this.soundBox.getChildAt(1).visible = false;
            this.bgmPlaying = true;
            Music.play('bgm');
            // SoundManager.$i.pauseBg(false);
        }
    }

    private jump(e:egret.TouchEvent):void{
        if(this.isJump==true||this.GAME_STATE != 'ing'){
            return;
        }
        this.jumpBtn.alpha = .8;
        // Music.playEffect('jump');
        // SoundManager.$i.playEffect('jump');
        var self = this;
        egret.setTimeout(function(){
            self.jumpBtn.alpha = 1;
        },this,500);
        this.speedY = 22;
        this.isJump = true;
        this.cow.gotoAndStop(1);
    }


    private power(e:egret.TouchEvent):void{
        if(this.isPower||this.GAME_STATE != 'ing'||this.powerBtn.isCountDown){
            return;
        }
        if (this.GAME_STATE == "end") { return;}
        this.isPower = true;
        this.powerBtn.startCountDown();
        this.cow.visible = false;
        this.power_cow.visible = true;
    }

    private powerOk(e:egret.Event):void{
        console.log('power can use!');
    }

    private powerTimerComplete(e:egret.Event):void{
        this.isPower = false;
        console.log('power end');
        this.cow.visible = true;
        this.power_cow.visible = false;
    }

    private run(dt:number):void{
        // 计算牛如果跳起时的实时坐标改变
        if(this.isJump == true){
            this.speedY -= this.GRAVITY * 0.1;
            this.cow.y -= this.speedY * .6;
        }
        if(this.cow.y > this.COW_START_Y){
            this.isJump = false;
            this.cow.gotoAndPlay('run',-1);
            this.cow.y = this.COW_START_Y;
        }
        // power时牛和普通时候牛的y坐标同步
        if(this.power_cow.visible == true){
            this.power_cow.y = this.cow.y+(this.cow.height-this.power_cow.height) / 2;
        }
        // 移动背景
        for (var i: number = 0; i < this.bgArr.length;i++){
            var ele: Background = this.bgArr[i];
            ele.x -= this.COW_VX;
            if(ele.x <= -ele.width){
                ele.x += ele.width*2;
            }
        }
        // 每经过一个屏幕的宽时就往之后的屏幕添加障碍物
        this.rx -= this.COW_VX;
        if(this.rx<0){
            this.rx = this.wStage.stageHeight;
            console.log(this.rx,'rx');
            this.addBlock();
            // console.log('add block');
        }
        // 移动障碍物
        for (var i: number = 0; i < this.showedBlockDictory.length;i++){
            var _ele:Block = this.showedBlockDictory[i];
            _ele.x -= this.COW_VX;
            if(_ele.x < -_ele.width){
                _ele.visible = false;
                this.showedBlockDictory.splice(i, 1);
                // console.log('remove block!',this.showedBlockDictory.length);
            }
        }
        // 碰撞
        if(this.isPower==false){
            this.checkCollision(this.cow);
        }else{
            //无敌时
            this.checkCollision(this.power_cow);
        }
        // 移动云
        this.cloudSp.x -= this.COW_VX * 0.05;
        if(this.cloudSp.x < -this.wStage.stageHeight*2) {
            this.cloudSp.x = this.wStage.stageHeight * 2;
        }
        // update score
        this.score += 1;
        this.scoreTxt.text = this.score+'点';
    }

    private addBlock():void{
        var r: number =  1;//Math.floor(Math.random() * 2 + 1);
        console.log('random', r);
        var first: boolean = true;
        var prevX:number;
        while(this.blockArr.length&&r>=0){
            var _r: number = Math.floor(this.blockArr.length * Math.random());
            var _b: Block = this.getBlockFromDic(_r);
            // console.log('choose',_r);
            if(_b){
                _b.visible = true;
                this.showedBlockDictory.push(_b);
                if(first){
                    _b.x = this.wStage.stageHeight+this.cow.width*1.5;
                    first = false;
                    prevX = _b.x;
                    // console.log('first _b.x', _b.x);
                }else{
                    _b.x = prevX + Math.floor(Math.random() * _b.width)+_b.width+this.cow.width*1.5;
                    prevX = _b.x;
                }
                // console.log('_b.x',_b.x,this.cow.width,_b.width);
                if(_b.type == 'bear'){
                    _b.y = this.wStage.stageWidth - 80 - _b.height;
                }else if(_b.type == 'block'){
                    _b.y = this.wStage.stageWidth - 92;
                }else{
                    _b.y = this.wStage.stageWidth - 80 - _b.height;
                }
                
            }
            // console.log('get block number:', r);
            r--;
        }
    }
    private checkCollision(cow:egret.DisplayObject):void{
        for (var i: number = 0; i < this.showedBlockDictory.length;i++){
            var ele = this.showedBlockDictory[i];
            if(ele.blockType == 1) {
                var cowX = cow.x + cow.width;
                var blockX = ele.x + 60;
                var cowY = cow.y + cow.height;
                var blockY = ele.y;
                if(cowX>blockX && cow.x < blockX - 40 && cowY >= blockY) {
                    // console.log('hit',cowX,blockX,cowY,blockY);
                        // var s: egret.Shape = new egret.Shape();
                        // s.graphics.beginFill(0xff0000, 1);
                        // s.graphics.drawRect(0 ,0 , ele.width, ele.height);
                        // s.graphics.endFill();
                        // s.x = blockX;
                        // s.y = blockY;
                        // this.addChild(s);
                    if(this.isPower){
                        //添加熊撞飞
                        if(ele.type == 'bear'){
                            this.bearBreak(ele);
                            ele.blockType = 2;
                        }
                    }else{
                        this.endGame(ele);
                    }
                }
                    

                // if(cow.hitTestPoint(ele.x,ele.y)){
                //     if(this.isPower){
                //         //添加熊撞飞
                //         if(ele.type == 'bear'){
                //             this.bearBreak(ele);
                //             ele.blockType = 2;
                //         }
                //     }else{
                //         this.endGame(ele);
                //     }
                // }
            }
            
        }
    }

    private bearBreak(bear:Block):void{
        // Music.playEffect('hit');
        // SoundManager.$i.playEffect('hit');
        var tw = egret.Tween.get(bear);
        var that = this;
        tw.to({ x: this.wStage.stageHeight + bear.width, y: bear.y - 100,rotation:-180 }, 1000).call(function(){
            var index = that.showedBlockDictory.indexOf(bear);
            // console.log('remove break bear!!',index);
            bear.visible = false;
            bear.y = that.wStage.stageWidth - 90 - bear.height;
            bear.rotation = 0;
            bear.blockType = 1;
            if(index!=-1){
                that.showedBlockDictory.splice(index, 1);
            }
        });
    }

    private endGame(ele:Block):void{
        this.cow.stop();
        this.cow.visible = false;
        this.failCow.y = this.cow.y;
        this.failCow.visible = true;
        // Music.playEffect('dead');
        Music.stop();
        // SoundManager.$i.stopBg();
        // SoundManager.$i.playEffect('dead');
        this.GAME_STATE = 'end';
        egret.Ticker.getInstance().unregister(this.run, this);
        this.showEndPanel();
        this.updateShareDesc();        
    }
    
    private updateShareDesc():void{
        window.share = window.share || {};
        if(window.share){
            window.share.setting.desc = '我带领牛市跑到了' + this.score + '点，打败了'+this.getPercentByScore(this.score) + '%的人，你也来试试吧。';
            
            var seting = {};
            for(var i in window.share.setting){
                seting[i] = window.share.setting[i];
            }
            seting['desc'] = window.share.setting.title;
            seting['title'] = window.share.setting.desc;
            if (window.wx) {
                // 注册微信事件
                var wx = window.wx;
                wx.ready(function() {
                    wx.onMenuShareTimeline(seting);
                    wx.onMenuShareAppMessage(window.share.setting);
                    wx.onMenuShareQQ(window.share.setting);
                    wx.onMenuShareWeibo(window.share.setting);
                });
            }
        }
    }

    private getPercentByScore(score:number):string{
        var result:number = 0;
        if(score<1000){
            result = Math.floor(Math.random() * 5 + 70);
        }else if(score>1000&&score<2000){
            result = Math.floor(Math.random() * 5 + 75);
        }else if(score>2000&&score<3000){
            result = Math.floor(Math.random() * 5 + 80);
        }else if(score>3000&&score<4000){
            result = Math.floor(Math.random() * 5 + 85);
        }else if(score>4000&&score<5000){
            result = Math.floor(Math.random() * 5 + 90);
        }else if(score>5000){
            result = Math.floor(Math.random() * 5 + 95);
        }
        var _r:string = result.toString();
        return _r;
    }

    private showEndPanel():void {
        this.updateEndPanelTxt();
        this.endPanel.visible = true;
    }

    private hideEndPanel():void {
        this.endPanel.visible = false;
        // var panel: HTMLElement = document.getElementById('overlay');
        // panel.style.visibility = 'hidden';
    }

    private resetGame():void{
        for (var i: number = 0; i < this.blockArr.length;i++) {
            this.blockArr[i].visible = false;
        }
        this.showedBlockDictory = [];
        this.cow.gotoAndPlay('run', -1);
        this.cow.visible = true;
        this.cow.y = this.COW_START_Y;
        this.failCow.visible = false;
        this.startGame();
        this.score = 0;
        this.powerBtn.countDownOk();
        this.scoreTxt.text = this.score + '点';
        this.hideEndPanel();
        this.GAME_STATE = "start";
    }

    private initBg():void{
        this.bgArr = new Array();
        for (var i: number = 0; i < 2;i++){
            var bg = new Background();
            bg.x = i * bg.width;
            this.addChild(bg);
            this.bgArr.push(bg);
        }
        var sun: egret.Bitmap = new egret.Bitmap();
        var t: egret.Texture = RES.getRes('sun');
        sun.texture = t;
        this.addChild(sun);
        sun.x = 27;
        sun.y = 37;
    }

    private initCow():void{
        var data = RES.getRes('cow_json');
        var texture = RES.getRes('cow_png');
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture); 

        var cow: egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData());
        this.addChild(cow);
        cow.x = 35;
        cow.y = this.wStage.stageWidth - 80 - cow.height;
        this.COW_START_Y = cow.y;
        cow.frameRate = 12;
        cow.gotoAndPlay('run',-1);
        this.cow = cow;

        this.power_cow = new egret.Sprite();
        this.power_cow.visible = false;
        var bmp: egret.Bitmap = new egret.Bitmap();
        var t: egret.Texture = RES.getRes('power_cow');
        bmp.texture = t;
        this.power_cow.x = cow.x - (this.cow.width - this.power_cow.width);
        this.power_cow.y = cow.y + (this.cow.height-this.power_cow.height) / 2;
        this.power_cow.addChild(bmp);
        this.addChild(this.power_cow);

        this.failCow = new egret.Bitmap(RES.getRes('fail'));
        this.failCow.x = cow.x;
        this.failCow.y = cow.y;
        this.failCow.visible = false;
        this.addChild(this.failCow);
    }

    private getBlockFromDic(index:number): Block {
        var result = null;
        if(this.blockArr[index]&&this.blockArr[index].visible == false){
            result = this.blockArr[index];
        }
        return result;
    }

    private initBlock():void {
        this.blockArr = new Array();

        for (var i: number = 0; i < 12;i++){
            var name: string;
            if(i%3 == 0 || (i%3 == 1&& i%2 !=0)){
                name = 'block';
            }else if(i%3 == 1&& i%2 ==0){
                name = 'bear';
            }else{
                var res: number = Math.floor((i-2) / 3);
                if(res/3 == 0){
                    name = 'tree1';
                }else if(res/3 == 1){
                    name = 'tree2';
                }else if(res/3 == 2){
                    name = 'tree3';
                }else{
                    name = 'tree4';
                }
            }
            var _b: Block = new Block(name);
            if(name == 'block'|| name == 'bear'){
                _b.blockType = 1;
            }else{
                _b.blockType = 2;
            }
            this.addChild(_b);
            _b.visible = false;
            this.blockArr.push(_b);
        }
    }
    private p3: egret.TextField;
    private initEndPanel():void {
        this.endPanel = new egret.Sprite();
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0x000000, 1);
        bg.graphics.drawRect(0, 0, this.wStage.stageHeight, this.wStage.stageWidth);
        bg.graphics.endFill();
        bg.alpha = .7;

        var btnbg: egret.Shape = new egret.Shape();
        btnbg.graphics.beginFill(0x0088ff, 1);
        btnbg.graphics.drawRoundRect(0, 0, 213, 40, 40, 40);
        btnbg.graphics.endFill();
        btnbg.x = this.wStage.stageHeight / 2 - btnbg.width / 2;
        btnbg.y = this.wStage.stageWidth / 2 - btnbg.height / 2 -30;
        btnbg.touchEnabled = true;
        btnbg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.helpTouch, this);

        var p1: egret.TextField = new egret.TextField();
        var p2: egret.TextField = new egret.TextField();
        var p3: egret.TextField = new egret.TextField();
        p1.textColor = 0x8fcbfd;
        p1.textFlow = new Array<egret.ITextElement>(
            {text:'壮士，你带股市牛狂奔'},
            {text:this.score.toString()+'点',style:{"textColor":0xfdad14,"bold":true}},
            {text:"，打败了"},
            {text:this.getPercentByScore(this.score).toString()+'%',style:{"textColor":0xfdad14,"bold":true}},
            {text:'的人'}
        );
        p1.name = 'info';
        // console.log('p1.width', p1.width,p1.textWidth);
        p1.x = btnbg.x - 40;
        p1.y = btnbg.y - 30;
        // p1.text = "壮士，你带股市牛狂奔" + this.score + "点，打败了" + this.getPercentByScore(this.score) + '%的人';
        p2.text = '再玩一次';
        p3.textFlow = new Array<egret.ITextElement>(
          { text:"挑战百度股市通模拟炒股大赛", style: { "href" : "event:text event triggered" } }
        );
        p2.x = btnbg.x + 83;
        p2.y = btnbg.y + 80;

        p3.x = btnbg.x + 20;
        p3.y = btnbg.y + 13;

        // p2.touchEnabled = true;
        p3.touchEnabled = true;

        var p2Rect: egret.Shape = new egret.Shape();
        p2Rect.graphics.beginFill(0xff0000, 1);
        p2Rect.graphics.drawRect(0, 0, p2.width, p2.height);
        p2Rect.graphics.endFill();
        p2Rect.x = p2.x - p2.width/2 + 30;
        p2Rect.y = p2.y - 5;
        p2Rect.alpha = 0;
        p2Rect.touchEnabled = true;

        

        var ico: egret.Bitmap = new egret.Bitmap(RES.getRes('reset'));
        ico.x = p2.x - 30;
        ico.y = p2.y - 5;
        p1.size = 16;
        p2.textColor = 0x8fcbfd;
        p3.size = 13;
        p2.size = 15;
        p1.fontFamily = p2.fontFamily = p3.fontFamily = 'microsoft yahei';

        // p2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGame, this);
        p3.addEventListener(egret.TextEvent.LINK, this.hrefed, this);
        p2Rect.addEventListener(egret.TouchEvent.TOUCH_TAP, this.resetGame, this);
        this.p3 = p3;
        this.endPanel.addChild(bg);
        this.endPanel.addChild(btnbg);
        this.endPanel.addChild(p1);
        this.endPanel.addChild(p2);
        this.endPanel.addChild(p3);
        this.endPanel.addChild(p2Rect);
        this.endPanel.addChild(ico);
        // console.log(this.endPanel.width, this.endPanel.height);
        this.addChild(this.endPanel);
        this.endPanel.visible = false;
    }

    private helpTouch(e):void{
        var _custom = new egret.Event(egret.TextEvent.LINK);
        this.p3.dispatchEvent(_custom);
    }

    private updateEndPanelTxt():void{
        var txt = <egret.TextField>(this.endPanel.getChildByName('info'));
        console.log(txt);
        txt.textFlow = new Array<egret.ITextElement>(
            {text:'壮士，你带股市牛狂奔'},
            {text:this.score.toString()+'点',style:{"textColor":0xfdad14,"bold":true}},
            {text:"，打败了"},
            {text:this.getPercentByScore(this.score).toString()+'%',style:{"textColor":0xfdad14,"bold":true}},
            {text:'的人'}
        );
    }
    private hrefed(e):void{
        if(window.log){
            window.log.download();
        }
        var para = window.bridge.urlQueryParams();
        if (para['from'] == 'bdstockapp') {
            if (window.bridge.platform == 'ios') {
                window.bridge.invoke('toStockMatch', {url:'https://gupiaoclient.baidu.com/stockmatch/safelogin?'}, function () {});
            }else {
                window.bridge.toMatch('https://gupiaoclient.baidu.com/stockmatch/safelogin?');
            }
            return;
        }


        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.baidu.fb';
    }
}
