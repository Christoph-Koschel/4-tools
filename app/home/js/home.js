const {ipcRenderer} = require("electron");

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

    document.getElementById("workcounter").addEventListener("click", () => {
        ipcRenderer.send("goToWorkcounter", "");
    });

    document.getElementById("clock").addEventListener("click", () => {
        ipcRenderer.send("goToClock", "");
    });

    document.getElementById("exit").addEventListener("click", () => {
        ipcRenderer.send("goToExit", "");
    });

    document.getElementById("calculator").addEventListener("click", () => {
        ipcRenderer.send("goToCalculator", "");
    });

    document.getElementById("notebook").addEventListener("click", () => {
        ipcRenderer.send("goToNotebook", "");
    });

    document.getElementById("settings").addEventListener("click", () => {
        ipcRenderer.send("goToSettings", "");
    });
});
