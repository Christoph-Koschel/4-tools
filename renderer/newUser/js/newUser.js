const {ipcRenderer} = require("electron");

window.addEventListener("load", () => {
    let stylecontroller = new styleController({
        dark: "./css/dark/dark.css",
        light: "./css/light/light.css",
        change: "0s",
        start: getSystemStyle()["style"]
    });


    window.addEventListener("keyup", (e) => {
        if (e.keyCode === 81 && e.ctrlKey) {
            let style = document.createElement("style");
            style.innerHTML = "* {transition: 0.5s}";
            document.head.appendChild(style);
            stylecontroller.toggle();
            setTimeout(() => {
                style.remove();
                ipcRenderer.send("toggleStyle");
            }, 500);
        }
    });

    document.getElementById("text").addEventListener("change", () => {
        newUser();
    });

    document.getElementById("button").addEventListener("click", () => {
        newUser();
    });

    function newUser() {
        let text = document.getElementById("text").value;
        if (text !== "" && text !== " ") {
            ipcRenderer.send("newUser", text);
        }
    }
});
