let eventData = [
    {
        name: "Gajian",
        date: "2024-10-25",
    },
    {
        name: "Bulan Puasa",
        date: "2025-02-28",
    },
    {
        name: "Lebaran",
        date: "2025-03-30",
    },
];

let currentIndex = 0;

const NEXT = "ArrowRight";
const PREV = "ArrowLeft";
const NEW_CONSOLE = "IntlBackslash";

const DAY_THEME = "DAY";

const DAY_MILISECOND = 86400000; // 1000 miliseconds * 60 seconds * 60 minutes * 24 hours

class Helper {
    static isValidAction(code, ...keys) {
        let isValid = false;
        keys.forEach(key => {
            if(code === key) isValid = true;
        })

        return isValid;
    }
}

class Application {
    version = "1.0.0";
    name = "What's New, upcoming event!";
    currentIndex = 0;

    constructor() {
        console.log("Halo apa kabar ?");
        this.initTheme();
    }

    display(action = "") {
        const eventData = new Events();

        eventData.removeExpired();

        if(action === NEXT) {
            if(this.currentIndex === eventData.length() - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
        } else if(action === PREV) {
            if(this.currentIndex === 0) {
                this.currentIndex = eventData.length() - 1;
            } else {
                this.currentIndex--;
            }
        }

        const eventContent = eventData.get(this.currentIndex);
        if(Object.keys(eventContent).length !== 0) {
            setContent("event-upcoming-day", upcomingDay(eventContent.date));
            setContent("event-name", `🎉 ${eventContent.name}`);
        } else {
//            setContent("event-upcoming-day", upcomingDay(eventContent.date));
            setContent("event-name", `No Event set yet`);
        }
    }

    getVersion() {
        return this.version;
    }

    getName() {
        return this.name;
    }

    updateTheme(target) {
        const theme = document.getElementById("app-theme").classList;

        if(target === "NIGHT") {
            theme.add("bg-nightmode");
            theme.remove("bg-daymode");
        } else if(target === DAY_THEME) {
            theme.add("bg-daymode");
            theme.remove("bg-nightmode");
        }
    }

    initTheme() {
        const time = new Date().getHours();

        if(time >= 18 || time <= 5) {
            this.updateTheme("NIGHT");
        } else {
            this.updateTheme("DAY");
        }
    }
}

class Events {
    data = [];

    constructor() {
        console.log("Event has been created");
        try {
            const db = new LocalDB("events");

            this.data = db.get() ?? [];
        } catch(err) {
            console.error(err);
        }
    }

    list() {
        return this.data;
    }

    get(id) {
        if(this.data.length === 0) {
            return {};
        }

        return this.data[id];
    }

    length() {
        return this.data.length;
    }

    add(event) {
        try {
            const db = new LocalDB("events");

            this.data = [...this.data, event];
            this.data.sort((a ,b) => new Date(a.date) - new Date(b.date));

            db.save(this.data);
        } catch(err) {
            console.error(err);
        }
    }

    removeExpired(){
        try {
            const db = new LocalDB("events")

            const today = new Date();

            const filteredEvent = this.data.filter(res => new Date(res.date) > today);

            this.data = [...filteredEvent];

            db.save(this.data);
        } catch(err) {
            console.error(err);
        }
    }
}

class LocalDB {
    key = "";
    constructor(key) {
        if(key === "") {
            throw "DB key must be set";
        }

        this.key = key;
    }

    save(value) {
        if(typeof value === "object") {
            value = JSON.stringify(value);
        }

        localStorage.setItem(this.key, value);
    }

    get() {
        let response;
        try {
            response = JSON.parse(localStorage.getItem(this.key));
        } catch(e) {
            response = localStorage.getItem(this.key);
        }

        return response;
    }

    reset() {
        localStorage.reset();
    }

    info() {
        return `db key name is ${this.key}`;
    }
}

const upcomingDay = (upcomingDate) => {
    const today = new Date();
    const upcoming = new Date(upcomingDate);

    const gap = upcoming - today;

    return Math.floor(gap / DAY_MILISECOND);
}

const save = (key, value) => {
    if(typeof value === "object") {
        value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
}

const get = (key) => {
    let response;
    try {
        response = JSON.parse(localStorage.getItem(key));
    } catch(e) {
        response = localStorage.getItem(key);
    }

    return response;
}

const resetDB = () => {
    localStorage.clear();
}

const setContent = (target, text) => {
    if(text === "") {
        return
    }
    document.getElementById(target).innerText = text;
}

const testDB = () => {
    console.log(upcomingDay("2024-03-11"));

    const user = {
        name: "insan kamil",
        age: 28,
        hobbies: ["membaca", "belajar", "bermain game"],
    };

    save("user", user);

    const userDB = get("user");

    console.log(userDB);

    resetDB();

    console.log(get("user"));

    save("token", "abc5dasar");

    console.log(get("token"));

    save("token", "edittoken");

    console.log(get("token"));

    resetDB();
}

const displayEvent = (action) => {
    let eventContent;

    if(action === NEXT) {
        if(currentIndex === eventData.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
    } else if(action === PREV) {
        if(currentIndex === 0) {
            currentIndex = eventData.length - 1;
        } else {
            currentIndex--;
        }
    }

    eventContent = eventData[currentIndex];
    setContent("event-upcoming-day", upcomingDay(eventContent.date));
    setContent("event-name", `🎉 ${eventContent.name}`);
}

const isValidAction = (code, ...keys) => {
    let isValid = false;
    keys.forEach(key => {
        if(code === key) isValid = true;
    })

    return isValid;
}

const app = new Application();

const popupModal = (target) => {
    console.log("target modal", target);
    try {
        const modal = new bootstrap.Modal(document.getElementById(target));
//        const modal = new bootstrap.Modal(`#${target}`, {});

        console.log("modal", modal);
        modal.toggle(target);
    } catch(err) {
        console.error(err);
    }
}

const changePage = (e) => {
    if(Helper.isValidAction(e.code, PREV, NEXT)) {
//        displayEvent(e.code);
        app.display(e.code);
    }

    console.log(e.code);

    if(Helper.isValidAction(e.code, NEW_CONSOLE)) {
        popupModal("addModal");
    }

    if(e.code === "ArrowUp") {
        console.table("before", eventData);

        eventData.sort((a, b) => new Date(a.date) - new Date(b.date));

        console.table("after", eventData);

        save("events", eventData);
    }

//    if(e.code === "ArrowLeft") {
//        displayEvent("PREV");
//    }
//
//    if(e.code === "ArrowRight") {
//        displayEvent("NEXT");
//    }
}


const initializeApp = () => {
    eventData = get("events") || [];

//    const app = new Application();

    console.log(app.getName());
    console.log(app.getVersion());

    app.display();
}

const _saveEvent = (event) => {
    try {
        eventData = [...eventData, event];

        eventData.sort((a, b) => new Date(a.date) - new Date(b.date));

        save("events", eventData);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

const addNewEvent = () => {
    let isValid = true;

    const name = document.getElementById("add-name");
    const date = document.getElementById("add-date");

    if(name.value === "") {
        setContent("add-name-error", "*event name cannot be empty");
        isValid = false;
    } else {
        setContent("add-name-error", "");
    }

    if(date.value === "") {
        setContent("add-date-error", "*event date cannot be empty");
        isValid = false;
    } else {
        setContent("add-name-error", "");
    }

    const event = {
        name: name.value,
        date: date.value,
    }

    return isValid && _saveEvent(event);
}

//window.onload = displayEvent;

window.onkeyup = changePage;

//const hiBaby = () => console.log("Halo, ngetest kakak!");

//window.addEventListener("load", testDB);

window.addEventListener("load", initializeApp);