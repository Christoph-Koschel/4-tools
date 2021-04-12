const fs = require("fs");
const path = require("path");
const {ipcRenderer} = require("electron");
const sysVariable = JSON.parse(unescape(window.location.href).split("?")[1]);

let activeEntries = [];
let activeEntry = {};

function addEventListeners() {
    window.addEventListener("keyup", (e) => {
        if (e.keyCode === 67 && e.ctrlKey) {
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

    document.getElementById("addForm").addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.forms["addForm"]["name"].value;
        document.forms["addForm"]["name"].value = "";
        let obj = {
            name: name,
            text: ""
        }
        activeEntries.push(obj);
        saveNotes();
        clearFrame();
        document.getElementById("listFrame").style.display = "";
        loadNoteEntries();
    });

    document.getElementById("saveBTN").addEventListener("click", () => {
        activeEntries[parseInt(activeEntry.id)].text = document.getElementById("writer").innerHTML;
        saveNotes();

        let img = document.getElementById("saveBTNIcon");
        img.src = "icon/check-circle-fill.svg";

        setTimeout(() => {
            img.src = "icon/check-circle.svg";
        }, 4 * 1000);
    });

    document.getElementById("closeBTN").addEventListener("click", () => {
        document.getElementById("writer").innerText = "";
        clearFrame();
        document.getElementById("listFrame").style.display = "";
        loadNoteEntries();
    });

    document.getElementById("deleteBTN").addEventListener("click", () => {
        document.getElementById("writer").innerText = "";
        let arr = [];
        for (let i = 0; i < activeEntries.length; i++) {
            if (activeEntry.id !== activeEntries[i].id) {
                arr.push(activeEntries[i]);
            }
        }
        activeEntries = arr;
        saveNotes();
        clearFrame();
        document.getElementById("listFrame").style.display = "";
        loadNoteEntries();
    });

    document.getElementById("writer").addEventListener("contextmenu", (event) => {
        emoji.open(event.clientX, event.clientY, "writer");
    });

    document.getElementById("backBTN").addEventListener("click",() => {
        clearFrame();
        document.getElementById("listFrame").style.display = "";
    });
}

function clearFrame() {
    document.getElementById("listFrame").style.display = "none";
    document.getElementById("writeFrame").style.display = "none";
    document.getElementById("addNoteFrame").style.display = "none";
}

function loadNoteEntries() {
    const filePath = path.join(sysVariable.userData, "note");
    let entries = "";
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        entries = JSON.parse(atob(fs.readFileSync(filePath, "utf8")));
    } else {
        entries = [];
    }

    document.getElementById("noteList").innerHTML = `<li><a class='first ${(entries.length === 0) ? "last" : ""}' onclick='newNote()' style='font-weight: bolder'>New note</a></li>`;
    for (let i = 0; i < entries.length; i++) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        if (i === entries.length - 1) {
            a.classList.add("last");
        }
        a.innerHTML = entries[i].name;
        a.addEventListener("click", () => {
            this.entry = entries[i];
            this.entry.id = i;
            openNote(this.entry);
        });
        li.appendChild(a);

        document.getElementById("noteList").appendChild(li);
    }

    document.getElementsByClassName("backBTN")[0].addEventListener("click", () => {
        ipcRenderer.send("goToHome", "");
    });

    activeEntries = entries;
}

function newNote() {
    clearFrame();
    document.getElementById("addNoteFrame").style.display = "";
}

function saveNotes() {
    const filePath = path.join(sysVariable.userData, "note");
    fs.writeFileSync(filePath, btoa(JSON.stringify(activeEntries)));
}

function openNote(entry) {
    if (!entry) {
        return;
    }

    clearFrame();
    document.getElementById("writeFrame").style.display = "";
    document.getElementById("writer").innerHTML = entry.text;

    activeEntry = entry;
}

const emoji = {
    size: 15,
    icons: [],
    iconsPath: path.join(__dirname, "emoji", "emoji.json"),
    open: async function (x, y, insert) {
        this.closeView();
        let panel = "<div class='iconList' style='padding: 0;margin: 0;border-radius:0;font-size:25px;background-color: #CCCCCC; width: 220px; height: 250px; overflow-x: hidden; overflow-y: auto; position: absolute; left: " + x + "px; top: " + y + "px;'><table>";
        let line = 0;
        for (let i = 0; i < this.icons.length; i++) {
            if (line === 0) {
                panel += "<tr>";
            }

            panel += "<td>" + this.icons[i].replace("<span", `<span onclick="emoji.insert('${insert}','${i}',event)" `) + "</td>";

            if (line === 4) {
                line = 0;
                panel += "</tr>";
            } else {
                line++;
            }
        }

        panel += "</table></div>";
        document.body.innerHTML += panel;
        addEventListeners();
    },
    load: function () {
        let json = fs.readFileSync(this.iconsPath, "utf8");
        try {
            json = JSON.parse(json);
            if (typeof json !== "object") {
                json = [];
            }
        } catch (e) {
            console.log(e);
            json = [];
        }

        this.icons = json;
    },
    closeView: function () {
        let iconList = document.getElementsByClassName("iconList");
        for (let i = 0; i < iconList.length; i++) {
            document.getElementsByClassName("iconList")[i].remove();
        }
    },
    insert: function (obj, id, event) {
        document.getElementById(obj).innerHTML += this.icons[id].replace("<span", "<span style='font-size: " + this.size + "px;' ").replace("</span>", "</span><a>&nbsp;</a>");
        if (!event.shiftKey) {
            this.closeView();
        }
    }
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

    addEventListeners();
    emoji.load();
    loadNoteEntries();
});
