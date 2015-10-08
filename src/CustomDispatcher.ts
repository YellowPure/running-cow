class CustomDispatcher extends egret.Event {
    public static START:string = 'start';
    public static POWER_END: string = 'power_end';
    public static POWER_COUNTDOWN: string = 'power_countdown';
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
        // code...
        super(type,bubbles,cancelable);
    }
}