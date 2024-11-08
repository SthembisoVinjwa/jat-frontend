const API_BASE_URL = 'https://jat-backend.onrender.com';

let loginButton = document.getElementById('login-btn');
let access_token = document.cookie.split('=')[1];
let hamburger = document.getElementById('hamburger');
let open = false;

var orginalUl;
hamburger.onclick = function() {
    open = !open;
    //  get nav and remove ul
    let nav = document.getElementsByTagName('nav')[0];
    let header = nav.parentNode;
    let mainUl = document.getElementsByTagName('ul')[0];

    if (mainUl.className === 'menu-ul') {
        // remove class and from bottom, place at original position
        let ul = header.removeChild(mainUl);
        ul.className = '';
        nav.insertBefore(ul, hamburger);
    } else {
        // inject class append ul to bottom of nav
        let ul = nav.removeChild(mainUl);
        ul.className = 'menu-ul';
        header.appendChild(ul);
    }
}

let x = window.matchMedia('(max-width: 630px)');
x.addEventListener('change', function() {
    if (open) {
        let header = document.getElementsByTagName('header')[0];
        let nav = document.getElementsByTagName('nav')[0];
        let ul = header.removeChild(document.getElementsByTagName('ul')[0]);
        ul.className = '';
        nav.insertBefore(ul, hamburger);
        open = false;
    }
});

/* If user is logged in */
if (access_token && access_token.length > 0) {
    loginButton.innerText = 'Logout';
} else {
    loginButton.innerText = 'Login';
}

/* Login */
loginButton.onclick = function () {
    if (access_token && access_token.length > 0) {
        document.cookie = 'access_token=' + '; path=/';
        window.location.href = '/';
    } else {
        window.location.href = '/login';
    }   
}

function adjustFooterPosition(entries) {
    const footer = document.getElementsByTagName('footer')[0];
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            footer.style.position = 'relative';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.getElementsByTagName('footer')[0];
    const addJob = document.getElementsByClassName('add-job')[0];

    if (footer && addJob) {
        const observer = new IntersectionObserver(adjustFooterPosition, {
            root: null, // Use the viewport as the container
            threshold: 0.01 // Adjust this threshold to trigger overlap earlier if needed
        });

        observer.observe(addJob); // Observe the `add-job` element
    }
});

