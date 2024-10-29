import token from "./token.js";
const table = document.querySelector('table');


(function() {
    const tasks = document.querySelectorAll('.task');
    const shadow = document.querySelector('.shadow');
    function CreateTask() {
        const form_create = document.querySelector(".form-create");
        const input = form_create.querySelector('input');

        form_create.addEventListener('submit',async function(event) {
            event.preventDefault();
            const Token = await token();
            
            const data = await fetch(`http://localhost:8080/create/task?token=${Token}`,{
                headers: {"Content-Type": "application/json",},
                method: "POST",
                body : JSON.stringify({
                    title: input.value
                })
            });

            if (data.redirected) {
                window.location.href = data.url;
                return;
            }
            const json = await data.json();
            alert(json.messagem)
        });
    };
    CreateTask();
    const id_task = document.querySelectorAll('#id-task');
    let id = '';
    function DeleteTask () {
        const delete_button = document.querySelectorAll('#delete-button');
        const question_delete = document.querySelector('.question-delete');


        const buttons = question_delete.querySelectorAll('button');
        for (let i = 0; i < tasks.length; i++) {
            delete_button[i].addEventListener('click',function() {
                id = id_task[i].textContent;
                question_delete.style.display = 'block';
                shadow.style.display = 'block';
            });
        };
        buttons[0].addEventListener("click",async function() {
            const Token = await token();
            const data = await fetch(`http://localhost:8080/delete/task?token=${Token}&id=${id}`,{
                headers: {"Content-Type": "application/json"},
                method: "DELETE"
            });

            if (data.redirected) {
                return window.location.href = data.url;
            };

            alert(await data.json().messagem);
        });
        buttons[1].addEventListener('click',function() {
            shadow.style.display = 'none';
            question_delete.style.display = 'none';
        });
    };
    function UpdateTask() {
        const edit_button = document.querySelectorAll('.edit-button');
        const container_update = document.querySelector('.update-task');

        const form_update = container_update.querySelector('form');
        const inputs = form_update.querySelectorAll('input');

       
        for (let i = 0; i < tasks.length;i++) {
            edit_button[i].addEventListener('click',function() {
                container_update.style.display = 'block';
                shadow.style.display = 'block';
                id = id_task[i].textContent;              
            });

        };

        form_update.addEventListener("submit",async event => {
            event.preventDefault();
            const Token = await token();
            
            const response = await fetch(`http://localhost:8080/update/task?token=${Token}&id=${id}`,{
                headers: {"Content-Type": "application/json"},
                method: "PUT",
                body: JSON.stringify({
                    title: inputs[0].value,
                    description: inputs[1].value
                })
            });
            if (response.redirected) {
                return window.location.href = response.url;
            }
            const json = await response.json();
            alert(json.messagem);
        });
    };

    function DoneTask() {
        const done_task = document.querySelectorAll('#check-button');
        
        for (let i = 0; i < tasks.length;i++) {
            done_task[i].addEventListener('click',async function() {
                id = id_task[i].textContent;
                console.log(id);
                const Token = await token();
                const data = await fetch(`http://localhost:8080/done/task?token=${Token}&id=${id}`,{
                    method: "PUT"
                });

                if (data.redirected) {
                    window.location.href = data.url;
                    return;
                }
                const json = await data.json();
                alert(json.messagem);
            });
        };
    };

    UpdateTask();
    DeleteTask();
    DoneTask();
})(); // actions task



