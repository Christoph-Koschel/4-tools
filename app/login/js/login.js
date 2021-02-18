let fs = require("fs");
const {ipcRenderer} = require("electron");

const sysVariable = JSON.parse(unescape(window.location.href).split("?")[1]);

window.addEventListener("load",() => {
    let SController = new styleController({
        dark: "./css/dark/dark.css",
        light: "./css/light/light.css",
        start:  getSystemStyle()["style"],
        change: "0s"
    });

    if (JSON.parse(atob(fs.readFileSync(sysVariable.userData + "\\clients","utf-8")))["password"] === "UNSPA") {
        ipcRenderer.send("autoLogin","");
    }

    document.getElementById("login").addEventListener("submit",(e) => {
        e.preventDefault();
        let password = document.forms["login"]["password"].value;
        let client = JSON.parse(atob(fs.readFileSync(sysVariable.userData + "\\clients","utf-8")));

        if (password === client.password) {
            ipcRenderer.send("goToHome");
        } else {
            document.forms["login"]["info"].innerHTML = "The password is wrong";
        }
    });

    window.addEventListener("keyup",(e) => {
        if (e.keyCode === 81 && e.ctrlKey) {
            let style = document.createElement("style");
            style.innerHTML = "* {transition: 0.5s}";
            document.head.appendChild(style);
            SController.toggle();
            setTimeout(() => {
                style.remove();
                ipcRenderer.send("toggleStyle");
            },500);
        }
    });
});
