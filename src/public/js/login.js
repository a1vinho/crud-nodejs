const text = document.querySelector('.text');

document.querySelector('.form-login').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    // Pega os valores dos inputs
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Configura a requisição POST
    const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const json = await response.json();

    if (json.token) {
        localStorage.session = json.token;
        window.location.href = `/home?token=${json.token}`;
        return;
    };
    text.textContent = json.messagem;

});
