class Counter {
    Start(timeStamp) {
        if (timeStamp) {
            this.startStamp = timeStamp;
        } else {
            this.startStamp = Date.now();
        }
        this.stopStamp = NaN;
        this.interval = setInterval(() => {
            eval("("+this.TimeChange + ")(new Date(Date.now() - this.startStamp))");
        });
    }
    Stop() {
        this.stopStamp = Date.now();
        let stamp = Date.now() - this.startStamp;
        clearInterval(this.interval);
        return new Date(stamp);
    }
    TimeChange = null;
}
