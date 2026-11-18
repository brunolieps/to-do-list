let darkMode = false;
loadDarkmode();

function Darkmode() {
    var root = document.documentElement;
    var buttonDarkMode = document.querySelector('#darkmodetoggle');

    if (darkMode) {
        root.style.setProperty('--primary', '#0b1f2a');
        root.style.setProperty('--secondary', '#0b1f2a');
        root.style.setProperty('--text', '#f0f4f8');
        root.style.setProperty('--shadow', '#000');

        root.style.setProperty('--papertexture', 'url(src/paper02.png)');
        buttonDarkMode.classList.add('ativo');
    } else {
        root.style.setProperty('--primary', '#0fa3b1');
        root.style.setProperty('--secondary', '#f0f4f8');
        root.style.setProperty('--text', '#0b1f2a');
        root.style.setProperty('--shadow', '#0b1f2a');

        root.style.setProperty('--papertexture', 'url(src/paper01.png)');
        buttonDarkMode.classList.remove('ativo');
    }
}

function loadDarkmode() {
    if (localStorage.getItem('darkmode') != null) {
        darkMode = localStorage.getItem('darkmode') === 'true';
        Darkmode();

        console.log('loaded darkmode: ' + darkMode);
    }
}

document.querySelector('#darkmodetoggle').addEventListener("click", function toggle() {
    darkMode = !darkMode;

    Darkmode();

    localStorage.setItem('darkmode', darkMode);
    console.log("toggle mode " + darkMode);
});