const fs = require("fs");
const {ipcRenderer} = require("electron");
const hash = require("password-hash");
const sysVariable = JSON.parse(unescape(window.location.href).split("?")[1]);

function checkPasswordType() {
    let type1 = document.getElementById("paType1");
    let type2 = document.getElementById("paType2");

    type1.style.display = "none";
    type2.style.display = "none";
    let client = getClient();
    if (client.password === "UNSPA") {
        type1.style.display = "";
    } else {
        type2.style.display = "";
    }
}

function getClient() {
    let fs = require("fs");
    return JSON.parse(atob(fs.readFileSync(sysVariable.userData + "\\clients", "utf8")));
}

function setClient(client) {
    let fs = require("fs");
    fs.writeFileSync(sysVariable.userData + "\\clients", btoa(JSON.stringify(client)));
}

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

    document.getElementById("calculatorDelete").addEventListener("click", () => {
        fs.unlinkSync(sysVariable.userData + "\\calculator");
    });

    document.getElementById("workcounterDelete").addEventListener("click", () => {
        fs.unlinkSync(sysVariable.userData + "\\count");
    });

    document.getElementById("notebookDelete").addEventListener("click", () => {
        fs.unlinkSync(sysVariable.userData + "\\note");
    });

    document.getElementById("goToHome").addEventListener("click", () => {
        ipcRenderer.send("goToHome");
    });

    document.getElementById("createPassword").addEventListener("submit", (e) => {
        e.preventDefault();
        let form = document.forms["createPassword"];
        let password = form["password"].value;

        form["password"].value = "";

        let client = getClient();
        client.password = hash.generate(password);
        setClient(client);
        checkPasswordType();
    });

    document.getElementById("changePassword").addEventListener("submit", (e) => {
        e.preventDefault();

        let form = document.forms["changePassword"];
        let oldP = form["passwordO"].value;
        let newP = form["passwordN"].value;
        let client = getClient();
        let message;


        form["passwordO"].value = "";
        form["passwordN"].value = "";
        if (hash.verify(oldP, client.password)) {
            client.password = hash.generate(newP);
            message = "Password successfully changed";
            setClient(client)
        } else {
            message = "The old password is wrong";
        }

        form["info"].innerHTML = message;

        setTimeout(() => {
            form["info"].innerHTML = "";
        }, 2 * 1000);
    });

    document.getElementById("deletePassword").addEventListener("submit", (e) => {
        e.preventDefault();
        let form = document.forms["deletePassword"];
        let password = form["password"].value;
        let client = getClient();
        if (hash.verify(password, client.password)) {
            client.password ="UNSPA";
            setClient(client);
            checkPasswordType();
            return;
        } else {
            form["info"].innerHTML = "Your password is wrong";
        }

        setTimeout(() => {
            form["info"].innerHTML = "";
        }, 2 * 1000);

    });

    checkPasswordType();
});
