let fs = require("fs");
let path = require("path");
const {app, BrowserWindow, ipcMain} = require("electron");

let userData = app.getPath("userData");

app.on("ready", () => {
    let settings = "";
    let win = new BrowserWindow({
        icon: path.join(__dirname, "res", "icon", "icon.ico"),
        title: "Four Tools",
        width: 1050,
        height: 600,
        minHeight: 600,
        minWidth: 1050,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);

    if (process.argv.indexOf("-d") !== -1) {
        win.webContents.openDevTools({
            mode: "undocked"
        });
    }

    win.on("close", () => {
        saveSetting();
        app.quit();
    });

    ipcMain.on("newUser", (event, args) => {
        fs.writeFileSync(path.join(userData, "clients"), Buffer.from(JSON.stringify({
            name: args,
            password: "UNSPA"
        })).toString("base64"));
        goToHome();
    });

    ipcMain.on("autoLogin", () => {
        goToHome();
    });

    ipcMain.on("toggleStyle", (event, args) => {
        settings.style = (settings.style === "dark") ? "light" : "dark";
        saveSetting();
    });

    ipcMain.on("setCounterSettings", (event, args) => {
        settings.counter.running = args.running;
        settings.counter.stop = args.stop;
        settings.counter.start = args.start;
        saveSetting();
    });

    ipcMain.on("goToWorkcounter", () => {
        goToWorkcounter();
    });

    ipcMain.on("goToHome", () => {
        goToHome();
    });

    ipcMain.on("goToClock", () => {
        goToClock();
    });

    ipcMain.on("goToExit", () => {
        win.close();
    });

    ipcMain.on("goToCalculator", () => {
        goToCalculator();
    });

    ipcMain.on("goToNotebook", () => {
        goToNotebook();
    });

    ipcMain.on("goToSettings", () => {
        goToSettings();
    });

    function systemVariables() {
        return JSON.stringify({
            userData: userData
        });
    }

    function checkSettings() {
        let temp = {
            style: "light",
            counter: {
                running: false,
                start: 0,
                stop: 0,
                fileList: path.join(app.getPath("userData"),"count")
            }
        }

        if (!fs.existsSync(path.join(userData, "settings"))) {
            fs.writeFileSync(path.join(userData, "settings"), Buffer.from(JSON.stringify(temp)).toString('base64'));
            settings = temp;
        } else {
            settings = fs.readFileSync(path.join(userData, "settings"), "utf-8");
            settings = new Buffer.from(settings, "base64");
            settings = settings.toString("utf-8");
            settings = JSON.parse(settings);
        }
    }

    function loginUser() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "login", "login.html") + "?" + systemVariables());
    }

    function newUser() {
        win.loadURL("file:///" +path.join(__dirname, "renderer", "newUser", "newUser.html") + "?" + systemVariables());
    }

    function saveSetting() {
        fs.writeFileSync(path.join(userData, "settings"), Buffer.from(JSON.stringify(settings)).toString("base64"));
    }

    function goToHome() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "home", "home.html") + "?" + systemVariables());
    }

    function goToWorkcounter() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "workCounter", "index.html") + "?" + systemVariables());
    }

    function goToClock() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "uhr", "index.html") + "?" + systemVariables());
    }

    function goToCalculator() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "calculator", "index.html") + "?" + systemVariables());
    }

    function goToNotebook() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "notebook", "index.html") + "?" + systemVariables());
    }

    function goToSettings() {
        win.loadURL("file:///" + path.join(__dirname, "renderer", "settings", "index.html")+  "?" + systemVariables());
    }

    checkSettings();

    if (fs.existsSync(path.join(userData, "clients"))) {
        loginUser();
    } else {
        newUser();
    }
});
