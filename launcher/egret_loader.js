//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

egret_h5.startGame = function () {
    var context = egret.MainContext.instance;
    context.touchContext = new egret.HTML5TouchContext();
    context.deviceContext = new egret.HTML5DeviceContext();
    context.netContext = new egret.HTML5NetContext();

    var deviceNum = document.documentElement.clientWidth/document.documentElement.clientHeight;
    // if(deviceNum>1){
        // egret.StageDelegate.getInstance().setDesignSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
    // }else{
        // var box = document.getElementById('gameDiv');
        // box.style.width = document.documentElement.clientHeight+'px';
        // box.style.height = document.documentElement.clientWidth+'px';
        // box.style.transform = 'rotate(90deg)';
        // box.style.transformOrigin = document.documentElement.clientWidth/2+'px';
        // egret.StageDelegate.getInstance().setDesignSize(document.documentElement.clientHeight, document.documentElement.clientWidth);
    // }
    egret.StageDelegate.getInstance().setDesignSize(320,568);
    var stage = new egret.Stage();
    // var scaleMode = egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE ? egret.StageScaleMode.NO_SCALE : egret.StageScaleMode.NO_SCALE;
    var wid = document.documentElement.clientWidth;
    var hei = document.documentElement.clientHeight;
    var bet=1;//iphone系列比较特殊，尺寸需要翻倍
    switch(wid){
        case 320://iphone4\5
            bet = 2;
            break;
        case 375://iphone 6
            bet = 2;
            break;
        case 414://iphone 6+
            bet = 3;
            break;
        default :
            bet =1;
            break;
    }
    wid *= bet; hei*= bet;
    var py=0;//y的纵坐标
    var per =hei/wid;
    if(egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE){
        if(per>=(568/320)){
            scaleMode = egret.StageScaleMode.SHOW_ALL; py =Math.floor((hei-568)/2);
            var heiContent = 320*per;    
            py = Math.floor((heiContent-568)/2);
        }
        else{scaleMode = egret.StageScaleMode.SHOW_ALL;}
    }else{//pc
        scaleMode = egret.StageScaleMode.NO_SCALE;
    }

    stage.scaleMode = scaleMode;

    context.stage = stage;

    //WebGL is a Egret's beta property. It's off by default.
    //WebGL是egret的Beta特性，默认关闭
    var rendererType = 0;
    if (rendererType == 1) {// egret.WebGLUtils.checkCanUseWebGL()) {
        console.log("Use WebGL mode");
        context.rendererContext = new egret.WebGLRenderer();
    }
    else {
        context.rendererContext = new egret.HTML5CanvasRenderer();
    }

    egret.MainContext.instance.rendererContext.texture_scale_factor = 1;
    context.run();

    var rootClass;
    if (document_class) {
        rootClass = egret.getDefinitionByName(document_class);
    }
    if (rootClass) {
        var rootContainer = new rootClass();
        if (rootContainer instanceof egret.DisplayObjectContainer) {
            rootContainer.rotation = 90;
            rootContainer.x = 320;
            rootContainer.y = py;
            context.stage.addChild(rootContainer);
        }

        else {
            throw new Error("Document Class must be the subclass to egret.DisplayObjectContainer!");
        }

    }
    else {
        throw new Error("Document Class is not found！");
    }

    //处理屏幕大小改变
    //implement for screen size change
    var resizeTimer = null;
    var doResize = function () {
        context.stage.changeSize();
        resizeTimer = null;
    };
    window.onresize = function () {
        if (resizeTimer == null) {
            resizeTimer = setTimeout(doResize, 300);
        }
        // var deviceNum = document.documentElement.clientWidth/document.documentElement.clientHeight;
        // if(deviceNum>1){
        //     var box = document.getElementById('gameDiv');
        //     box.style.width = document.documentElement.clientWidth+'px';
        //     box.style.height = document.documentElement.clientHeight+'px';
        //     box.style.transform = 'rotate(0deg)';
        //     box.style.transformOrigin = '0px';
        //     // 横屏
        //     if (resizeTimer == null) {
        //         resizeTimer = setTimeout(doResize, 300);
        //     }
        // }else{
        //     // alert('竖屏！'+document.documentElement.clientWidth+'::'+document.documentElement.clientHeight);
        //     var box = document.getElementById('gameDiv');
        //     box.style.width = document.documentElement.clientHeight+'px';
        //     box.style.height = document.documentElement.clientWidth+'px';
        //     box.style.transform = 'rotate(90deg)';
        //     box.style.transformOrigin = document.documentElement.clientWidth/2+'px';
        //     // egret.StageDelegate.getInstance().setDesignSize(568, 320);
        //     if (resizeTimer == null) {
        //         resizeTimer = setTimeout(doResize, 300);
        //     }
        // }
        
    };
};