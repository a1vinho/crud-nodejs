export default async function() {
    const data = await fetch('http://localhost:8080/sessions')
    const {login} = await data.json();
    

    return login;
};