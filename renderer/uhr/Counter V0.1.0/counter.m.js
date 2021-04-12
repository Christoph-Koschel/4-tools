export class Counter {
    Start() {
        this.startStamp = Date.now();
        this.interval = setInterval(() => {
            eval("("+this.TimeChange + ")(new Date(Date.now() - this.startStamp))");
        });
    }
    Stop() {
        let stamp = Date.now() - this.startStamp;
        clearInterval(this.interval);
        return new Date(stamp);
    }
    TimeChange = null;
}
