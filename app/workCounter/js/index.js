const fs = require("fs");
const {ipcRenderer} = require("electron");
const counter = new Counter();
const setting = getSystemStyle();

window.addEventListener("load", () => {
    let styleHandler = new styleController({
        start: setting.style,
        change: "0s",
        light: "./css/light/light.css",
        dark: "./css/dark/dark.css"
    });

    loadEntries();

    document.getElementsByClassName("menuOpen")[0].addEventListener("click", () => {
        if (fs.existsSync(setting.counter.fileList) && fs.statSync(setting.counter.fileList).isFile()) {
            let list = JSON.parse(atob(fs.readFileSync(setting.counter.fileList, "utf-8")));

            let table = document.getElementById("contentTable");
            table.innerHTML = "";

            table.innerHTML += `<tr><td><a><b>Start:</b></a></td><td><a><b>Stop:</b></a></td><td><a><b>Difference:</b></a></td></tr>`;
            for (let i = 0; i < list.length; i++) {
                table.innerHTML += `<tr><td><a>${new Date(list[i].start).getDate() + "." + (new Date(list[i].start).getMonth() + 1) + "." + new Date(list[i].start).getFullYear() + "&nbsp;" + new Date(list[i].start).getHours() + ":" + new Date(list[i].start).getMinutes() + ":" + new Date(list[i].start).getSeconds()}</a></td><td><a>${new Date(list[i].stop).getDate() + "." + (new Date(list[i].stop).getMonth() + 1) + "." + new Date(list[i].stop).getFullYear() + "&nbsp;" + new Date(list[i].stop).getHours() + ":" + new Date(list[i].stop).getMinutes() + ":" + new Date(list[i].stop).getSeconds()}</a></td><td><ul><li>${"Milliseconds: " + (new Date(list[i].stop - list[i].start).getMilliseconds() - 1)}</li><li>${"Seconds: " + new Date(list[i].stop - list[i].start).getSeconds()}</li><li>${"Minutes: " + new Date(list[i].stop - list[i].start).getMinutes()}</li><li>${"Hour: " + (new Date(list[i].stop - list[i].start).getHours() - 1)}</li></ul></td></tr>`;
            }
        }

        let menu = document.getElementsByClassName("menu")[0];
        let interval = setInterval(() => {
            let positionLeft = menu.style.left;
            positionLeft = parseFloat(positionLeft.replace("%", ""));
            positionLeft = positionLeft - 20;
            menu.style.left = positionLeft.toString() + "%";
            if (positionLeft <= 0) {
                clearInterval(interval);
            }
        }, 15);
    });

    document.getElementsByClassName("menuClose")[0].addEventListener("click", () => {
        let menu = document.getElementsByClassName("menu")[0];
        let interval = setInterval(() => {
            let positionLeft = menu.style.left;
            positionLeft = parseFloat(positionLeft.replace("%", ""));
            positionLeft = positionLeft + 20;
            menu.style.left = positionLeft.toString() + "%";
            if (positionLeft >= 200) {
                clearInterval(interval);
            }
        }, 15);
    });

    document.getElementsByClassName("backToHome")[0].addEventListener("click", () => {
        ipcRenderer.send("goToHome");
    });

    document.getElementById("counterStart").addEventListener("click", () => {
        counter.Start();
        counter.TimeChange = (e) => {
            let str = (e.getHours() - 1 <= 9) ? "0" + (e.getHours() -1).toString().toString() : e.getHours() - 1;
            str += ":";
            str += (e.getMinutes() <= 9) ? "0" + e.getMinutes().toString() : e.getMinutes();
            str += ":";
            str += (e.getSeconds() <= 9) ? "0" + e.getSeconds().toString() : e.getSeconds();
            document.getElementById("boxText").innerText = str;
        }
        ipcRenderer.send("setCounterSettings", {
            running: true,
            start: counter.startStamp,
            stop: 0
        });

        document.getElementById("counterStart").style.display = "none";
        document.getElementById("counterStop").style.display = "initial";
    });

    document.getElementById("counterStop").addEventListener("click", () => {
        counter.Stop();
        let list;
        if (fs.existsSync(setting.counter.fileList)) {
            list = JSON.parse(atob(fs.readFileSync(setting.counter.fileList, "utf-8")));
        } else {
            list = [];
        }

        list.push(new Object({
            start: counter.startStamp,
            stop: counter.stopStamp
        }));

        fs.writeFileSync(setting.counter.fileList, btoa(JSON.stringify(list)));
        ipcRenderer.send("setCounterSettings", {
            running: false,
            start: 0,
            stop: 0
        });

        document.getElementById("counterStart").style.display = "initial";
        document.getElementById("counterStop").style.display = "none";

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

    function loadEntries() {
        let table = document.getElementById("contentTable");
        table.innerHTML = "";
        table.innerHTML += `<tr><td><a><b>Start:</b></a></td><td><a><b>Stop:</b></a></td><td><a><b>Difference:</b></a></td></tr>`;

        if (fs.existsSync(setting.counter.fileList) && fs.statSync(setting.counter.fileList).isFile()) {
            let list = JSON.parse(atob(fs.readFileSync(setting.counter.fileList, "utf-8")));

            for (let i = 0; i < list.length; i++) {
                table.innerHTML += `<tr><td><a>${new Date(list[i].start).getDate() + "." + (new Date(list[i].start).getMonth() + 1) + "." + new Date(list[i].start).getFullYear() + "&nbsp;" + new Date(list[i].start).getHours() + ":" + new Date(list[i].start).getMinutes() + ":" + new Date(list[i].start).getSeconds()}</a></td><td><a>${new Date(list[i].stop).getDate() + "." + (new Date(list[i].stop).getMonth() + 1) + "." + new Date(list[i].stop).getFullYear() + "&nbsp;" + new Date(list[i].stop).getHours() + ":" + new Date(list[i].stop).getMinutes() + ":" + new Date(list[i].stop).getSeconds()}</a></td><td><ul><li>${"Milliseconds: " + (new Date(list[i].stop - list[i].start).getMilliseconds() - 1)}</li><li>${"Seconds: " + new Date(list[i].stop - list[i].start).getSeconds()}</li><li>${"Minutes: " + new Date(list[i].stop - list[i].start).getMinutes()}</li><li>${"Hour: " + (new Date(list[i].stop - list[i].start).getHours() - 1)}</li></ul></td></tr>`;
            }
        }

        if (setting.counter.running) {
            document.getElementById("counterStop").style.display = "initial";
            counter.Start(setting.counter.start);
            counter.TimeChange = (e) => {
                let str = (e.getHours() - 1 <= 9) ? "0" + (e.getHours() -1).toString() : e.getHours() - 1;
                str += ":";
                str += (e.getMinutes() <= 9) ? "0" + e.getMinutes().toString() : e.getMinutes();
                str += ":";
                str += (e.getSeconds() <= 9) ? "0" + e.getSeconds().toString() : e.getSeconds();
                document.getElementById("boxText").innerText = str;
            }
        } else {
            document.getElementById("counterStart").style.display = "initial";
        }
    }
});

