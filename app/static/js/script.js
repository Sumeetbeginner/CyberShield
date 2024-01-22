
changeTheme();

function changeTheme() {
    if (localStorage.getItem("ModeColor") == "dark") {
        document.documentElement.style.setProperty('--light', "#2f3046")
        document.documentElement.style.setProperty('--dark', "#14152a")
        document.documentElement.style.setProperty('--material', "#3a3fc5")
        document.documentElement.style.setProperty('--text', "#ffffff")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

        document.getElementById("modeColor").className = "fa-solid fa-sun";
    }
    else {
        document.documentElement.style.setProperty('--light', "#DCF2F1")
        document.documentElement.style.setProperty('--dark', "#7FC7D9")
        document.documentElement.style.setProperty('--material', "#0F1035")
        document.documentElement.style.setProperty('--text', "black")
        document.documentElement.style.setProperty('--lightText', "#ffffff")

        localStorage.setItem("ModeColor", "light");

        document.getElementById("modeColor").className = "fa-solid fa-moon";
    }

}

document.getElementById("signupButton").addEventListener('click', function(){
    window.location = "login"
})

document.getElementById("modeColor").addEventListener('click', function(){
    changeMode();
})

function changeMode() {

    if (localStorage.getItem("ModeColor") == "light") {
        localStorage.setItem("ModeColor", "dark")
        document.getElementById("modeColor").className = "fa-solid fa-sun";
    }
    else {
        localStorage.setItem("ModeColor", "light")
        document.getElementById("modeColor").className = "fa-solid fa-moon";
    }

    changeTheme();
}


export {changeTheme};