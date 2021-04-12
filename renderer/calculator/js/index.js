const fs = require("fs");
const path = require("path");
const {ipcRenderer} = require("electron");
const sysVariable = JSON.parse(unescape(window.location.href).split("?")[1]);
let calcArray = [];
let calcStep = 0;
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
        ipcRenderer.send("goToHome", "");
    });

    readLog();
});

function clickField(event) {
    switch (event.innerText) {
        case "0":
            pushInt(0);
            break;
        case "1":
            pushInt(1);
            break;
        case "2":
            pushInt(2);
            break;
        case "3":
            pushInt(3);
            break;
        case "4":
            pushInt(4);
            break;
        case "5":
            pushInt(5);
            break;
        case "6":
            pushInt(6);
            break;
        case "7":
            pushInt(7);
            break;
        case "8":
            pushInt(8);
            break;
        case "9":
            pushInt(9);
            break;
        case "+":
            pushType("+");
            break;
        case "/":
            pushType("/");
            break;
        case "*":
            pushType("*");
            break;
        case "-":
            pushType("-");
            break;
        case "=":
            return calculate();
        case "CE":
            calcStep = 0;
            calcArray = [];
            break;
    }
    writeCalc();
}

function pushInt(int) {
    if (calcArray[calcStep] !== undefined) {
        calcArray[calcStep] += int.toString();
    } else {
        calcArray[calcStep] = int.toString();
    }
}

function pushType(type) {
    if (calcArray[calcStep] === undefined) {
        calcArray[calcStep] = "0";
    }
    calcStep++;
    calcArray[calcStep] = type;
    calcStep++;
}

function calculate() {
    let calc = "";
    let result = "";
    for (let i = 0; i < calcArray.length; i++) {
        calc += calcArray[i];
    }

    if (calcArray.length === 0) {
        result = "SYNTAX ERROR!";
        document.getElementById("output").value = result;
        return null;
    } else if (calcArray.length === 1) {
        result = "SYNTAX ERROR!";
        document.getElementById("output").value = result;
        return null;
    }

    calcArray = [];
    calcStep = 0;

    try {
        result = eval(calc);
        if (isNaN(result)) {
            result = "SYNTAX ERROR!";
        } else if (result === Infinity) {
            result = "SYNTAX ERROR!";
        }
        document.getElementById("output").value = result;
        if (result !== "SYNTAX ERROR") {
            writeLog(calc + "=" + result);
        }
    } catch {
        result = "SYNTAX ERROR!";
        document.getElementById("output").value = result;
    }

}

function writeCalc() {
    let result = "";
    for (let i = 0; i < calcArray.length; i++) {
        result += calcArray[i];
    }
    document.getElementById("output").value = result;
}

function writeLog(str) {
    let file;
    if (fs.existsSync(path.join(sysVariable.userData, "calculator")) && fs.statSync(path.join(sysVariable.userData, "calculator")).isFile()) {
        file = JSON.parse(atob(fs.readFileSync(path.join(sysVariable.userData, "calculator"), "utf-8")));
    } else {
        file = [];
    }
    file.unshift(str);
    fs.writeFileSync(path.join(sysVariable.userData, "calculator"), btoa(JSON.stringify(file)));
    readLog();
}

function readLog() {
    let file;
    if (fs.existsSync(path.join(sysVariable.userData, "calculator")) && fs.statSync(path.join(sysVariable.userData, "calculator")).isFile()) {
        file = JSON.parse(atob(fs.readFileSync(path.join(sysVariable.userData, "calculator"), "utf-8")));
    } else {
        file = [];
    }
    let list = document.getElementById("list");

    list.innerHTML = "";

    for (let i = 0; i < file.length; i++) {
        list.innerHTML += `<li><a>${file[i]}</a></li>`;
    }
}
