function getSystemStyle() {
    let sysVariable = JSON.parse(unescape(window.location.href).split("?")[1]);
    let fs = require("fs");
    return JSON.parse(atob(fs.readFileSync(sysVariable.userData + "\\settings", "utf-8")));
}
