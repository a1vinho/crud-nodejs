const form_register = document.querySelector('.form-register');
const inputs = form_register.querySelectorAll('input');

const text = document.querySelector('.p-text');
form_register.addEventListener('submit',async function(event) {
    event.preventDefault();

    const data = await fetch('http://localhost:8080/register',{
        headers: {"Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({
            username: inputs[0].value,
            email: inputs[1].value,
            password: inputs[2].value
        })
    });

    const json = await data.json();

    text.textContent = json.messagem;

});