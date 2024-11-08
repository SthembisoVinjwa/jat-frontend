let overlay = document.getElementsByClassName('overlay')[0];
let overlayOpen = false;
let loader = document.getElementsByClassName('loader')[0];

function validateEmail(input) {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return input.match(validRegex);
}

function signup() {
    let form = document.getElementById('signup');
    let firstname = form.firstname.value;
    let lastname = form.lastname.value;
    let email = form.email.value;
    let password = form.password.value;
    let formMessage = document.getElementById("formMessage");
    formMessage.innerText = "";

    // perform validation
    if (firstname === '') {
        formMessage.innerText = 'first name cannot be empty';
        return;
    }
    if (lastname === '') {
        formMessage.innerText = 'last name cannot be empty';
        return;
    }
    if (email === '' || password === '') {
        formMessage.innerText = 'email/password cannot be empty';
        return;
    } else {
        if (!validateEmail(email)) {
            formMessage.innerText = 'invalid email';
            return;
        }
    }

    openOverlay();
    showLoader();

    // send fetch request
    let status = 404;
    fetch(API_BASE_URL + '/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password
        }) 
    }).then(result => {
        closeOverlay();
        closeLoader();
        status = result.status;
        result.json().then(data => {
            if (status === 200) {
                setCookie('access_token', data.token, 30);
                window.location.assign('/');
            } else {
                formMessage.innerText = data.message;
            }
        });
    }).catch(err => {
        closeOverlay();
        closeLoader();
        alert(err);
    });
}

function setCookie (cName, cValue, expDays) {
    let date = new Date()
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'
}

function openOverlay() {
    overlay.style.display = 'block'; 
    overlayOpen = true;
}

function closeOverlay() {
    overlay.style.display = 'none'; 
    overlayOpen = false;
}    

function showLoader() {
    openOverlay();
    loader.style.display = 'block';
}

function closeLoader() {
    loader.style.display = 'none';
    closeOverlay();
}