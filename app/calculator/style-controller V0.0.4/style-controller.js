class styleController {
    constructor({
                    start = "dark",
                    light = "./css/light.css",
                    dark = "./css/dark.css",
                    change = "0.3s"
                }) {
        this.$mode = start;
        this.$change = change;
        this.$src = [];
        this.$src["light"] = light;
        this.$src["dark"] = dark;
        this.create();
    }

    dark($src) {
        this.$mode = "dark";
        if ($src !== undefined) {
            this.$src["dark"] = $src
        }
        this.create();
    }

    light($src) {
        this.$mode = "light";
        if ($src !== undefined) {
            this.$src["light"] = $src
        }
        this.create()
    }

    toggle() {
        if (this.$mode === "light") {
            this.dark();
        } else {
            if (this.$mode === "dark") {
                this.light();
            }
        }
    }

    create() {
        let id = document.getElementById("styleControler");
        let style = document.getElementById("styleControllerFlow");
        if (style === null) {
            let styleTag = document.createElement("style");
            styleTag.setAttribute("id","styleControllerFlow");
            styleTag.innerHTML = "* { transition: "+this.$change+";}";
            document.head.appendChild(styleTag);
        }
        if (id === null) {
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", this.$src[this.$mode]);
            link.setAttribute("type", "text/css");
            link.setAttribute("id", "styleControler");
            document.head.appendChild(link);
        } else {
            if (this.$mode === "light") {
                id.href = this.$src["light"];
                this.$mode = "light";
            } else {
                if (this.$mode === "dark") {
                    id.href = this.$src["dark"];
                    this.$mode = "dark";
                }
            }

        }
        
    }

    get data() {
        this.$data = [];
        this.$data["mode"] = this.$mode;
        this.$data["change Time"] = this.$change
        this.$data["src"] = [];
        this.$data["src"]["light"] = this.$src["light"];
        this.$data["src"]["dark"] = this.$src["dark"];
        return this.$data;
    }
}