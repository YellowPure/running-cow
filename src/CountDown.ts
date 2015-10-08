class CountDown extends egret.Sprite {
    
    public bg: egret.Bitmap;
    private countDownBtn: egret.MovieClip;
    private powerTimer: egret.Timer;
    private countDownTimer: egret.Timer;
    /**
     * 是否正在冷却中
     * @type {boolean}
     */
    public isCountDown: boolean = false;
    public constructor() {
        super();
        var _bit2:egret.Bitmap = new egret.Bitmap();
        var _texture:egret.Texture = RES.getRes('power');
        _bit2.texture = _texture;
        this.bg = _bit2;

        this.addChild(_bit2);



        this.powerTimer = new egret.Timer(3000, 1);
        this.powerTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerEnd, this);
        this.countDownTimer = new egret.Timer(10500, 1);
        this.countDownTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.powerOk, this);
        
        var data = RES.getRes('countdown_json');
        var texture = RES.getRes('countdown_gif');
        var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture); 

        var _b:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData());
        
        _b.x = 18;
        _b.y = 18;
        _b.frameRate = .3;
        _b.stop();
        // _b.gotoAndPlay('run',-1);
        _b.visible = false;
        this.addChild(_b);

        var _mask: egret.Shape = new egret.Shape();
        _mask.graphics.beginFill(0xff0000, 1);
        _mask.graphics.drawRect(0, 0, 100, 80);
        _mask.x = -30;
        _mask.y = 8;
        _mask.alpha = 0;
        this.addChild(_mask);
        this.countDownBtn = _b;

        // var svgBox = document.createElement('div');
        // svgBox.id = 'svgBox';
        // document.body.appendChild(svgBox);
        // svgBox.style.display = 'none';
    }
    private powerEnd(e:egret.TimerEvent):void{
        this.countDownBtn.visible = true;
        this.countDownBtn.gotoAndPlay('run',-1);
        this.bg.visible = false;

        var _custom = new CustomDispatcher(CustomDispatcher.POWER_END);
        this.dispatchEvent(_custom);
        console.log('powerEnd');
    }

    private powerOk(e:egret.TimerEvent):void{
        this.countDownOk();
    }

    public countDownOk():void{
        this.bg.visible = true;
        this.countDownBtn.visible = false;
        this.countDownBtn.stop();
        this.isCountDown = false;
        console.log('countdown finish');
    }
    public startCountDown():void{
        this.powerTimer.start();
        this.countDownTimer.start();
        this.isCountDown = true;
    }
    // private removeSVGCountDown():void{
    //     var svgBox:HTMLElement = document.getElementById('svgBox');
    //     if(svgBox){
    //         svgBox.innerText = '';
    //         svgBox.style.display = 'none';
    //     }
    // }
    // private addSVGCountDown():void{
    //     console.log(this.x, this.y);
    //     var svgBox:HTMLElement = document.getElementById('svgBox');
    //     svgBox.style.display = 'block';
    //     var _d = document.documentElement.clientWidth / document.documentElement.clientHeight;
    //     var w = 385 / 568;
    //     var h = 248 / 320;
    //     var svgW = 56;
    //     var strokeW = 5;
    //     if(_d>1){
            
    //     }else{
    //         svgW = svgW * _d;
    //     }
    //     svgBox.style.left = (w*document.body.clientWidth) + 'px';
    //     svgBox.style.top = (h*document.body.clientHeight+(document.documentElement.clientHeight - document.body.clientHeight)/2 )+ 'px';
        

    //     var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //     svg.setAttribute('width', svgW.toString());
    //     svg.setAttribute('height', svgW.toString());
    //     svg.setAttribute('viewbox', '0 0 '+svgW.toString()+' '+svgW.toString());

    //     var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    //     var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    //     circle.setAttribute('cx',(svgW/2).toString());
    //     circle.setAttribute('cy', (svgW/2).toString());
    //     circle.setAttribute('r', ((svgW - strokeW)/2).toString());
    //     circle.setAttribute('stroke-width', strokeW.toString());
    //     circle.setAttribute('stroke', "#db2900");
    //     circle.setAttribute('fill', 'none');
    //     svg.appendChild(g);
    //     g.appendChild(circle);
    //     svgBox.appendChild(svg);
    // }
}