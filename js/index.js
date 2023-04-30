window.onload = () => {
    if (localStorage.getItem("access") !== undefined && localStorage.getItem("access") !== null) {
        const payload = localStorage.getItem("payload")
        const payload_parse = JSON.parse(payload)

        intro.innerHTML = "<h4>" + payload_parse.email + "님의 페이지</h4>"
            + "<a href='mypage.html' role='button' class='outline' style='margin-right:30px;'>내 정보 수정</a>"
            + "<a href='/' role='button' class='outline' onclick='handleLogout()'>로그아웃</a>"
            + "<p><br><label>할일 작성하기 : </label><input type='text', name='todo', id='todo' /></p>"
            + "<a href='/' role='button' class='outline' onclick='handleTodo()'>등록하기</a>"
            + "<div id='content'></div>"

        TodoShow();
    }
}


async function TodoShow() {
    const payload = localStorage.getItem("payload")
    const user_parse = JSON.parse(payload).user_id

    const response = await fetch('http://127.0.0.1:8000/todo/' + user_parse + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        method: 'GET',
    })

    response_json = await response.json()

    response_json.forEach(todo => {
        if (todo.is_complete == false) {
            content.innerHTML += "<article><h4 id='todo" + todo.id + "'>" + todo.title + "</h4><p> 생성일 : " + todo.created_at.substr(0, 10) + "</p><p> 수정일 : "
                + todo.updated_at.substr(0, 10) + "</p><a class='contrast'><button onclick='TodoFinish(" + todo.id + ")'>"
                + "Finish" + "</button></a><a class='contrast'><button onclick='TodoDelete(" + todo.id + ")'>" + "Delete" + "</button></a></article>"
        }
        else {
            content.innerHTML += "<article><h4 id='todo" + todo.id + "' style='text-decoration:line-through'>" + todo.title + "</h4><p> 생성일 : "
                + todo.created_at.substr(0, 10) + "</p><p> 수정일 : "
                + todo.updated_at.substr(0, 10) + "</p><p> 완료일 : " + todo.completion_at.substr(0, 10)
                + "</p><a class='contrast'><button onclick='TodoDelete(" + todo.id + ")'>" + "Delete" + "</button></a></article>"
        }
    });
}


async function handleTodo() {
    const todo = document.getElementById("todo").value

    const response = await fetch('http://127.0.0.1:8000/todo/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "title": todo,
        })
    })
}


async function TodoFinish(id) {
    const user = localStorage.getItem("payload")
    const user_parse = JSON.parse(user).user_id
    const todo = document.getElementById("todo" + id).innerText

    const response = await fetch('http://127.0.0.1:8000/todo/' + user_parse + '/' + id + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
            "title": todo,
            "is_complete": true,
        })
    })

    window.location.href = "/"
}


async function TodoDelete(id) {
    const user = localStorage.getItem("payload")
    const user_parse = JSON.parse(user).user_id

    console.log(id)
    const response = await fetch('http://127.0.0.1:8000/todo/' + user_parse + '/' + id + '/', {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
        },
        method: 'DELETE',
    })

    window.location.href = "/"
}


async function handleMypage(id) {
    const form = document.getElementById("mypage_form")

    const response = await fetch('http://127.0.0.1:8000/users/' + id, {
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
}


function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
}