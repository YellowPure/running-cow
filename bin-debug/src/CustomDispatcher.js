var CustomDispatcher = (function (_super) {
    __extends(CustomDispatcher, _super);
    function CustomDispatcher(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        // code...
        _super.call(this, type, bubbles, cancelable);
    }
    var __egretProto__ = CustomDispatcher.prototype;
    CustomDispatcher.START = 'start';
    CustomDispatcher.POWER_END = 'power_end';
    CustomDispatcher.POWER_COUNTDOWN = 'power_countdown';
    return CustomDispatcher;
})(egret.Event);
CustomDispatcher.prototype.__class__ = "CustomDispatcher";
