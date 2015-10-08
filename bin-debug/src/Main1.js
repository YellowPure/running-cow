/**
 * 第三方 物理引擎演示
 */
var Main1 = (function (_super) {
    __extends(Main1, _super);
    function Main1() {
        _super.call(this);
        this._isDebug = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var __egretProto__ = Main1.prototype;
    __egretProto__.onAddToStage = function (event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     */
    __egretProto__.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    /**
     * preload资源组加载进度
     */
    __egretProto__.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     */
    __egretProto__.createGameScene = function () {
        egret.Profiler.getInstance().run();
        var factor = 50;
        //创建world
        var world = new p2.World();
        world.sleepMode = p2.World.BODY_SLEEPING;
        //创建plane
        var planeShape = new p2.Plane();
        var planeBody = new p2.Body();
        planeBody.addShape(planeShape);
        planeBody.displays = [];
        world.addBody(planeBody);
        egret.Ticker.getInstance().register(function (dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            world.step(dt / 1000);
            if (!self._isDebug) {
                var stageHeight = egret.MainContext.instance.stage.stageHeight;
                var l = world.bodies.length;
                for (var i = 0; i < l; i++) {
                    var boxBody = world.bodies[i];
                    var box = boxBody.displays[0];
                    if (box) {
                        box.x = boxBody.position[0] * factor;
                        box.y = stageHeight - boxBody.position[1] * factor;
                        box.rotation = 360 - boxBody.angle * 180 / Math.PI;
                        if (boxBody.sleepState == p2.Body.SLEEPING) {
                            box.alpha = 0.5;
                        }
                        else {
                            box.alpha = 1;
                        }
                    }
                }
            }
        }, this);
        //鼠标点击添加刚体
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, addOneBox, this);
        var self = this;
        function addOneBox(e) {
            var positionX = Math.floor(e.stageX / factor);
            var positionY = Math.floor((egret.MainContext.instance.stage.stageHeight - e.stageY) / factor);
            if (Math.random() > 0.5) {
                //添加方形刚体
                var boxShape = new p2.Rectangle(2, 1);
                var boxBody = new p2.Body({ mass: 1, position: [positionX, positionY], angularVelocity: 1 });
                boxBody.addShape(boxShape);
                world.addBody(boxBody);
                var display = self.createBitmapByName("rect");
                display.width = 2 * factor;
                display.height = 1 * factor;
            }
            else {
                //添加圆形刚体
                var boxShape = new p2.Circle(1);
                var boxBody = new p2.Body({ mass: 1, position: [positionX, positionY] });
                boxBody.addShape(boxShape);
                world.addBody(boxBody);
                var display = self.createBitmapByName("circle");
                display.width = 1 * 2 * factor;
                display.height = 1 * 2 * factor;
            }
            if (!self._isDebug) {
                display.anchorX = display.anchorY = .5;
                boxBody.displays = [display];
                self.addChild(display);
            }
        }
        if (this._isDebug) {
            //开启debug模式，使用图形绘制
            this.debug(world);
        }
    };
    /**
     * debug模式，使用图形绘制
     */
    __egretProto__.debug = function (world) {
        var factor = 50;
        var canvas = document.createElement("canvas");
        var stage = egret.MainContext.instance.stage;
        var stageWidth = stage.stageWidth;
        var stageHeight = stage.stageHeight;
        canvas.width = stageWidth;
        canvas.height = stageHeight;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgba(" + 255 + "," + 255 + "," + 0 + "," + 1 + ")";
        ctx.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 0 + "," + 1 + ")";
        ctx.lineWidth = 1;
        var rendererContext = egret.MainContext.instance.rendererContext;
        var f = rendererContext.onRenderFinish;
        rendererContext.onRenderFinish = function () {
            ctx.clearRect(0, 0, stageWidth, stageHeight);
            var l = world.bodies.length;
            for (var i = 0; i < l; i++) {
                var boxBody = world.bodies[i];
                if (boxBody.sleepState == p2.Body.SLEEPING) {
                    ctx.globalAlpha = 0.5;
                }
                else {
                    ctx.globalAlpha = 1;
                }
                for (var j = 0; j < boxBody.shapes.length; j++) {
                    var boxShape = boxBody.shapes[j];
                    if (boxShape instanceof p2.Rectangle) {
                        var x = (boxBody.position[0] + +boxBody.shapeOffsets[j][0]) * factor;
                        var y = stageHeight - (boxBody.position[1] + +boxBody.shapeOffsets[j][1]) * factor;
                        var w = (boxShape).width * factor;
                        var h = (boxShape).height * factor;
                        var matrix = egret.Matrix.identity.identity();
                        matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                        ctx.save();
                        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                        ctx.beginPath();
                        ctx.rect(-(boxShape).width / 2 * factor, -(boxShape).height / 2 * factor, w, h);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                    else if (boxShape instanceof p2.Plane) {
                        ctx.save();
                        ctx.setTransform(1, 0, 0, 1, 0, stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor);
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(stageWidth, 0);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.restore();
                    }
                    else if (boxShape instanceof p2.Circle) {
                        var x = (boxBody.position[0] + boxBody.shapeOffsets[j][0]) * factor;
                        var y = stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor;
                        var matrix = egret.Matrix.identity.identity();
                        matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                        ctx.save();
                        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                        ctx.beginPath();
                        ctx.arc(0, 0, (boxShape).radius * factor, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.closePath();
                        ctx.restore();
                    }
                }
            }
            rendererContext["_cacheCanvasContext"].drawImage(canvas, 0, 0, stageWidth, stageHeight, 0, 0, stageWidth, stageHeight);
            f.call(rendererContext);
        };
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    __egretProto__.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main1;
})(egret.DisplayObjectContainer);
Main1.prototype.__class__ = "Main1";
