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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
        this.url = './resource/assets/guide.png';
        this.url2 = './resource/assets/logo.png';
        this.loadCount = 0;
        this.createView();
    }
    var __egretProto__ = LoadingUI.prototype;
    __egretProto__.createView = function () {
        var loader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        loader.load(new egret.URLRequest(this.url));
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        var loader2 = new egret.URLLoader();
        loader2.dataFormat = egret.URLLoaderDataFormat.TEXTURE;
        loader2.load(new egret.URLRequest(this.url2));
        loader2.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        var _stage = egret.MainContext.instance.stage;
        var bg = new egret.Shape();
        bg.graphics.beginFill(0xfff2bf, 1);
        bg.graphics.drawRect(0, 0, _stage.stageHeight, _stage.stageWidth);
        bg.graphics.endFill();
        this.addChild(bg);
        var textField = new egret.TextField();
        textField.width = 116;
        textField.height = 50;
        textField.y = _stage.stageWidth - 76;
        textField.textColor = 0x7c7c7c;
        textField.x = _stage.stageHeight / 2 - textField.width / 2;
        textField.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        textField.textAlign = "center";
        textField.text = 'Loading... ...';
        textField.size = 12;
        this.addChild(textField);
        var textField3 = new egret.TextField();
        textField3.y = _stage.stageWidth - 30;
        textField3.textColor = 0x344249;
        textField3.x = _stage.stageHeight / 2 - 46;
        textField3.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        textField3.text = '百度股市通创新小组出品';
        textField3.size = 12;
        this.addChild(textField3);
        this.wStage = _stage;
        this.loadBar = new egret.Sprite();
        var barBg = new egret.Shape();
        barBg.graphics.beginFill(0xb5b5b5, 1);
        barBg.graphics.drawRoundRect(0, 0, 203, 7, 5, 5);
        barBg.graphics.endFill();
        this.loadBar.addChild(barBg);
        var bar = new egret.Shape();
        bar.graphics.beginFill(0x0088ff, 1);
        bar.graphics.drawRoundRect(0, 0, 203, 7, 5, 5);
        bar.graphics.endFill();
        bar.mask = new egret.Rectangle(0, 0, 0, 7);
        this.loadBar.addChild(bar);
        this.loadBar.x = _stage.stageHeight / 2 - this.loadBar.width / 2;
        this.loadBar.y = _stage.stageWidth - 90;
        this.addChild(this.loadBar);
        this.startBtn = new egret.Sprite();
        var _s = new egret.Shape();
        _s.graphics.beginFill(0x0088ff, 1);
        _s.graphics.drawRoundRect(0, 0, 203, 40, 40, 40);
        _s.graphics.endFill();
        var _t = new egret.TextField();
        _t.text = '立即开始';
        _t.fontFamily = 'Microsoft YaHei,Arial,sans-serif';
        _t.textAlign = "center";
        _t.textColor = 0xffffff;
        _t.size = 16;
        _t.width = 203;
        _t.y = 13;
        this.startBtn.addChild(_s);
        this.startBtn.addChild(_t);
        this.startBtn.x = _stage.stageHeight / 2 - this.startBtn.width / 2;
        this.startBtn.y = _stage.stageWidth - 102;
        this.addChild(this.startBtn);
        this.startBtn.visible = false;
        this.startBtn.touchEnabled = true;
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onStart, this);
    };
    __egretProto__.onStart = function (e) {
        var _custom = new CustomDispatcher(CustomDispatcher.START);
        this.dispatchEvent(_custom);
    };
    __egretProto__.onLoadComplete = function (e) {
        var loader = e.target;
        //获取加载到的纹理对象
        var texture = loader.data;
        var req = loader._request;
        this.loadCount++;
        if (req.url == this.url) {
            // guide
            var bit = new egret.Bitmap();
            bit.texture = texture;
            bit.x = 25;
            bit.y = this.wStage.stageHeight / 2 - bit.width / 2;
            this.addChild(bit);
        }
        else if (req.url == this.url2) {
            // logo
            var logo = new egret.Bitmap();
            logo.texture = texture;
            logo.y = this.wStage.stageWidth - 39;
            logo.x = this.wStage.stageHeight / 2 - 77;
            this.addChild(logo);
        }
        if (this.loadCount == 2) {
            //初始化Resource资源加载库
            //initiate Resource loading library
            RES.loadConfig("resource/resource.json", "resource/");
        }
    };
    __egretProto__.setProgress = function (current, total) {
        //显示进度
        var rect = new egret.Rectangle(0, 0, Math.round(current / total * 203), 7);
        this.loadBar.getChildAt(1).mask = rect;
        // this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI;
})(egret.Sprite);
LoadingUI.prototype.__class__ = "LoadingUI";
