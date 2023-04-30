async function handleSignup() {
    const form = document.getElementById("signup_form")

    const response = await fetch('http://127.0.0.1:8000/users/signup/', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": form.email.value,
            "password": form.password.value,
            "name": form.name.value,
            "gender": form.gender.value,
            "age": form.age.value,
            "introduction": form.introduction.value,
        })
    })

    if (response.status == 400) {
        alert("다시 입력해 주세요!")
        window.location.reload()
    }
}

async function handleLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch('http://127.0.0.1:8000/users/api/token/', {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })

    if (response.status == 401) {
        alert("다시 입력해 주세요!")
        window.location.reload()
    }
    else {
        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        window.location.href = "/"
    }
}

async function handleMock() {
    const user = localStorage.getItem("payload")
    const user_parse = JSON.parse(user).user_id

    const response = await fetch('http://127.0.0.1:8000/users/' + user_parse + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })
}