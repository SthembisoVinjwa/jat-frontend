function validateEmail(input) {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return input.match(validRegex);
}

function signin() {
    let form = document.getElementById("login");
    let email = form.email.value;
    let password = form.password.value;
    let formMessage = document.getElementById("formMessage");
    formMessage.innerText = "";

    // perform validation
    if (email === '' || password === '') {
        formMessage.innerText = 'email/password cannot be empty';
        return;
    } else {
        if (!validateEmail(email)) {
            formMessage.innerText = 'invalid email/password';
            return;
        }
    }

    // send fetch request
    let status = 404;
    fetch(API_BASE_URL + '/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        }) 
    }).then(result => {
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
        alert(err);
    });
}

function setCookie (cName, cValue, expDays) {
    let date = new Date()
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000)
    const expires = 'expires=' + date.toUTCString()
    document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/'
}