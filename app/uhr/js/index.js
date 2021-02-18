const {ipcRenderer} = require("electron");
let timer;
/**
 * @param "clock" | "timer";
 */
let activeView = "clock";

window.addEventListener("load", () => {
    let styleHandler = new styleController({
        start: getSystemStyle()["style"],
        light: "./css/light/light.css",
        dark: "./css/dark/dark.css",
        change: "0s"
    });

    window.addEventListener("keyup", (e) => {
        if (e.keyCode === 81 && e.ctrlKey) {
            let style = document.createElement("style");
            style.innerHTML = "* {transition: 0.5s}";
            document.head.appendChild(style);
            styleHandler.toggle();
            setTimeout(() => {
                style.remove();
                ipcRenderer.send("toggleStyle");
            }, 500);
        }
    });

    document.getElementById("goToHome").addEventListener("click", () => {
        ipcRenderer.send("goToHome");
    });

    setInterval(() => {
        let text = document.getElementById("mainClockText");
        const date = new Date();
        let str = (date.getHours() > 9) ? date.getHours().toString() : "0" + date.getHours().toString();
        str += ":";
        str += (date.getMinutes() > 9) ? date.getMinutes().toString() : "0" + date.getMinutes().toString();
        str += ":";
        str += (date.getSeconds() > 9) ? date.getSeconds().toString() : "0" + date.getSeconds().toString();
        text.innerText = str;
    }, 500);

    document.getElementById("goToClock").addEventListener("click", () => {
        if (activeView !== "clock") {

            document.getElementById("goToCounter").classList.remove("active");
            document.getElementById("goToClock").classList.remove("active");

            let timerView = document.getElementById("mainTimer");
            let clockView = document.getElementById("mainClock");

            clockView.style.left = "200%";
            timerView.style.left = "0%";

            let interval = setInterval(() => {
                let timerViewLeft = parseInt(timerView.style.left.split("%")[0]);
                timerViewLeft -= 20;
                timerView.style.left = timerViewLeft.toString() + "%";

                let clockViewLeft = parseInt(clockView.style.left.split("%")[0]);
                clockViewLeft -= 20;
                clockView.style.left = clockViewLeft.toString() + "%";

                if (clockViewLeft <= 0) {
                    document.getElementById("goToClock").classList.add("active");
                    timerView.style.left = "-200%";
                    clockView.style.left = "0%";
                    activeView = "clock";
                    clearInterval(interval);
                }
            }, 20);
        }
    });


    document.getElementById("goToCounter").addEventListener("click", () => {
        if (activeView !== "timer") {
            document.getElementById("goToCounter").classList.remove("active");
            document.getElementById("goToClock").classList.remove("active");

            let timerView = document.getElementById("mainTimer");
            let clockView = document.getElementById("mainClock");

            clockView.style.left = "0";
            timerView.style.left = "-200%";

            let interval = setInterval(() => {
                let timerViewLeft = parseInt(timerView.style.left.split("%")[0]);
                timerViewLeft += 20;
                timerView.style.left = timerViewLeft.toString() + "%";

                let clockViewLeft = parseInt(clockView.style.left.split("%")[0]);
                clockViewLeft += 20;
                clockView.style.left = clockViewLeft.toString() + "%";

                if (timerViewLeft >= 0) {
                    document.getElementById("goToCounter").classList.add("active");
                    timerView.style.left = "0%";
                    clockView.style.left = "200%";
                    activeView = "timer";
                    clearInterval(interval);
                }
            }, 20);
        }
    });

    document.getElementById("timerStart").addEventListener("click", () => {
        document.getElementById("mainTimerText").innerHTML = "00:00:00";
        document.getElementById("timerStart").style.display = "none";
        document.getElementById("timerStop").style.display = "initial";
        timer = new Counter();
        timer.TimeChange = function (date) {
            let set = "";
            set += ((date.getHours() -1).toString().length === 1) ? "0" + (date.getHours() -1).toString() : (date.getHours() -1).toString();
            set += ":";
            set += (date.getMinutes().toString().length === 1) ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
            set += ":";
            set += (date.getSeconds().toString().length === 1) ? "0" + date.getSeconds().toString() : date.getSeconds().toString();
            document.getElementById("mainTimerText").innerHTML = set;
        }
        timer.Start();
    });

    document.getElementById("timerStop").addEventListener("click",() => {
        document.getElementById("timerStart").style.display = "initial";
        document.getElementById("timerStop").style.display = "none";
        let date = timer.Stop();
        let set = "";
        set += ((date.getHours() -1).toString().length === 1) ? "0" + (date.getHours() -1).toString() : (date.getHours() -1).toString();
        set += ":";
        set += (date.getMinutes().toString().length === 1) ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
        set += ":";
        set += (date.getSeconds().toString().length === 1) ? "0" + date.getSeconds().toString() : date.getSeconds().toString();
        document.getElementById("mainTimerText").innerHTML = set;
    });
});
