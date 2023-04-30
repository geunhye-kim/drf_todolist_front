window.onload = () => {
    MyShow();
}


async function MyShow() {
    const payload = localStorage.getItem("payload")
    const user_parse = JSON.parse(payload).user_id

    const response = await fetch('http://127.0.0.1:8000/users/' + user_parse + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    response_json = await response.json()

    document.getElementById('email').value = response_json.email
    document.getElementById('password').value = response_json.password
    document.getElementById('name').value = response_json.name
    document.getElementById('gender').value = response_json.gender
    document.getElementById('age').value = response_json.age
    document.getElementById('introduction').value = response_json.introduction
}


async function handleMypage() {
    const form = document.getElementById("mypage_form")
    const payload = localStorage.getItem("payload")
    const user_parse = JSON.parse(payload).user_id

    const response = await fetch('http://127.0.0.1:8000/users/' + user_parse + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'PUT',
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

    window.location.href = "/"

}


async function handleMydelete() {
    const user = localStorage.getItem("payload")
    const user_parse = JSON.parse(user).user_id

    const response = await fetch('http://127.0.0.1:8000/users/' + user_parse + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'DELETE',
    })

    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.href = "/"
}