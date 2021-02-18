let fs = require("fs");
const {app, BrowserWindow, ipcMain} = require("electron");

let userData = app.getPath("userData");

app.on("ready", () => {
    console.log(app.getPath("userData"));

    let settings = "";
    let win = new BrowserWindow({
        icon: __dirname + "\\res\\icon\\icon.ico",
        title: "4 Tools",
        width: 1050,
        height: 600,
        minHeight: 600,
        minWidth: 1050,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.setMenu(null);
    win.on("close", () => {
        saveSetting();
        app.quit();
    });

    ipcMain.on("newUser", (event, args) => {
        fs.writeFileSync(userData + "\\clients", Buffer.from(JSON.stringify({
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
                fileList: app.getPath("userData") + "\\count"
            }
        }

        if (!fs.existsSync(userData + "/setting")) {
            fs.writeFileSync(userData + "/setting", Buffer.from(JSON.stringify(temp)).toString('base64'));
            settings = temp;
        } else {
            settings = fs.readFileSync(userData + "/setting", "utf-8");
            settings = new Buffer.from(settings, "base64");
            settings = settings.toString("utf-8");
            settings = JSON.parse(settings);
        }
    }

    function loginUser() {
        win.loadURL("file:///" + __dirname + "/app/login/login.html?" + systemVariables());
    }

    function newUser() {
        win.loadURL("file:///" + __dirname + "/app/newUser/newUser.html?" + systemVariables());
    }

    function saveSetting() {
        fs.writeFileSync(userData + "\\setting", Buffer.from(JSON.stringify(settings)).toString("base64"));
    }

    function goToHome() {
        win.loadURL("file:///" + __dirname + "/app/home/home.html?" + systemVariables());
    }

    function goToWorkcounter() {
        win.loadURL("file:///" + __dirname + "/app/workCounter/index.html?" + systemVariables());
    }

    function goToClock() {
        win.loadURL("file:///" + __dirname + "/app/uhr/index.html?" + systemVariables());
    }

    function goToCalculator() {
        win.loadURL("file:///" + __dirname + "/app/calculator/index.html?" + systemVariables());
    }

    function goToNotebook() {
        win.loadURL("file:///" + __dirname + "/app/notebook/index.html?" + systemVariables());
    }

    function goToSettings() {
        win.loadURL("file:///" + __dirname + "/app/settings/index.html?" + systemVariables());
    }

    checkSettings();

    if (fs.existsSync(userData + "\\clients")) {
        loginUser();
    } else {
        newUser();
    }
});
