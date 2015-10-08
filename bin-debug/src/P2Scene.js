var P2Scene = (function (_super) {
    __extends(P2Scene, _super);
    function P2Scene() {
        _super.call(this);
        this.factor = 50;
        this.PLAYER_VY = 9;
        this.PLAYER_VX = 5;
        this.GROUND = Math.pow(2, 2);
        this.PLAYER = Math.pow(2, 0);
        this.BLOCK = Math.pow(2, 1);
        this.wStage = egret.MainContext.instance.stage;
        this.init();
    }
    var __egretProto__ = P2Scene.prototype;
    __egretProto__.init = function () {
        this.initWorld();
        this.initBg();
        this.initFloor();
        this.initPlayer();
        this.initBlock();
        egret.Ticker.getInstance().register(this.run, this);
        this.addBtn();
    };
    __egretProto__.initBg = function () {
        this.bgArr = new Array();
        for (var i = 0; i < 2; i++) {
            var _bg = new Background();
            _bg.x = i * this.wStage.stageWidth;
            this.addChild(_bg);
            this.bgArr.push(_bg);
        }
    };
    __egretProto__.addBtn = function () {
        var _j = new MButton('跳跃');
        _j.x = 0;
        _j.y = this.wStage.stageHeight - _j.height;
        this.addChild(_j);
        _j.touchEnabled = true;
        _j.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jump, this);
        var _w = new MButton('无敌');
        _w.x = _j.width + 10;
        _w.y = this.wStage.stageHeight - _w.height;
        _w.touchEnabled = true;
        this.addChild(_w);
        _w.addEventListener(egret.TouchEvent.TOUCH_TAP, this.invincible, this);
    };
    __egretProto__.jump = function (e) {
        this.playerBody.velocity[1] = this.PLAYER_VY;
    };
    __egretProto__.invincible = function (e) {
    };
    __egretProto__.run = function (dt) {
        this.world.step(0.05);
        var disp = this.playerBody.displays[0];
        var loc = this.getEgretPos(this.playerBody);
        disp.x = loc[0];
        disp.y = loc[1];
        for (var i = 0; i < this.bgArr.length; i++) {
            var ele = this.bgArr[i];
            ele.x -= this.PLAYER_VX;
            if (ele.x < -this.wStage.stageWidth) {
                ele.x = this.wStage.stageWidth;
                this.randomAddBlock();
            }
        }
        var blockDisp = this.block.blockBody.displays[0];
        this.block.blockBody.velocity[0] = -this.PLAYER_VX;
        var loc = this.getEgretPos(this.block.blockBody);
        blockDisp.x = loc[0];
        blockDisp.y = loc[1];
        // check Collision
        this.checkCollision();
    };
    __egretProto__.checkCollision = function () {
        var result = this.hitTestByTwoBody(this.playerBody, this.block.blockBody);
    };
    __egretProto__.hitTestByTwoBody = function (_p1, _p2) {
        var result = false;
        return result;
    };
    __egretProto__.randomAddBlock = function () {
        var disp = this.block.blockBody.displays[0];
        var x = Math.random() * this.wStage.stageWidth + this.wStage.stageWidth;
        this.block.blockBody.position[0] = x / this.factor;
        this.block.blockBody.updateAABB();
        console.log('block position', this.block.blockBody.position, this.block.blockBody.getAABB());
    };
    __egretProto__.initWorld = function () {
        var _w = new p2.World();
        this.wRect = new egret.Rectangle(0, 0, this.wStage.stageWidth, this.wStage.stageHeight - 50);
        world.islandSplit = true;
        world.sleepMode = p2.World.ISLAND_SLEEPING;
        _w.solver.iterations = 20;
        _w.solver.tolerance = 0.001;
        _w.setGlobalStiffness(1e4);
        this.world = _w;
    };
    __egretProto__.initPlayer = function () {
        var _pDisplay = new Player();
        _pDisplay.anchorX = _pDisplay.anchorY = .5;
        var _p = new p2.Body({
            mass: 1,
            fixedRotation: true,
            position: [(30 + _pDisplay.width / 2) / this.factor, (_pDisplay.height) / this.factor],
            type: p2.Body.DYNAMIC
        });
        _p.id = 2;
        this.world.addBody(_p);
        this.playerBody = _p;
        var _pRect = new p2.Rectangle(_pDisplay.width / this.factor, _pDisplay.height / this.factor);
        _p.addShape(_pRect);
        // _p.shapes[0].collisionGroup = this.PLAYER;
        // _p.shapes[0].collisionMask = this.GROUND | this.BLOCK;
        this.addChild(_pDisplay);
        _p.displays = [_pDisplay];
        var egretPos = this.getEgretPos(_p);
        console.log(egretPos[0], egretPos[1], _pDisplay.width, _pDisplay.height, _p.getAABB());
        _pDisplay.x = egretPos[0];
        _pDisplay.y = egretPos[1];
    };
    __egretProto__.initFloor = function () {
        var _f = new p2.Body({
            mass: 1,
            fixedRotation: true,
            position: [0, 0],
            type: p2.Body.STATIC
        });
        _f.id = 1;
        this.world.addBody(_f);
        var _fRect = new p2.Rectangle(this.wRect.width * 4 / this.factor, 10 / this.factor);
        _f.addShape(_fRect);
        var sp = new egret.Shape();
        sp.graphics.beginFill(0x666666, 1);
        sp.graphics.drawRect(0, 0, this.wRect.width * 4, 10);
        sp.anchorX = sp.anchorY = .5;
        // _f.shapes[0].collisionGroup = this.GROUND;
        // _f.shapes[0].collisionMask = this.PLAYER | this.BLOCK;
        this.addChild(sp);
        _f.displays = [sp];
        var egretPos = this.getEgretPos(_f);
        console.log('floor pos', egretPos[0], egretPos[1]);
        sp.x = egretPos[0];
        sp.y = egretPos[1];
    };
    __egretProto__.initBlock = function () {
        var _block = new MBlock();
        var egretPos = this.getEgretPos(_block.blockBody);
        var _v = _block.blockBody.displays[0];
        _v.x = 700;
        _v.y = 100;
        _block.blockBody.position = this.getP2Pos(_v.x, _v.y);
        // _block.blockBody.shapes[0].collisionGroup = this.BLOCK;
        // _block.blockBody.shapes[0].collisionMask = this.GROUND;
        console.log('block pos', egretPos[0], egretPos[1], 'block collisionGroup:', _block.blockBody.shapes[0].collisionGroup, _block.blockBody.shapes[0].collisionMask);
        this.world.addBody(_block.blockBody);
        this.addChild(_v);
        this.block = _block;
    };
    __egretProto__.getP2Pos = function (x, y) {
        return [x / this.factor, y / this.factor];
    };
    __egretProto__.getEgretPos = function (body) {
        var xP2 = body.position[0];
        var yP2 = body.position[1];
        return [xP2 * this.factor, this.wRect.height - yP2 * this.factor];
    };
    return P2Scene;
})(egret.Sprite);
P2Scene.prototype.__class__ = "P2Scene";
