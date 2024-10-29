import mysql from "../services/database.js";

export default class {
    static async Home (request,response) {
        if (!request.session.login) {
            return response.status(401).redirect("/login");
        };
        const tasks = (await mysql.query('SELECT * FROM tasks WHERE user_id = ?',request.user.id)).find(data => data);
        
        return response.status(200).render('index',{
            css: 'http://localhost:8080/css/index.css',
            js: 'http://localhost:8080/js/index.js',
            token:request.session.login,
            tasks
        });
    };
    static Register(request,response) {
        return response.status(200).render('forms/register/index', {
            css: "http://localhost:8080/css/forms/register.css",
            js: "http://localhost:8080/js/register.js"
        });
    };
    static Login(request,response) {
        return response.status(200).render('forms/login/login', {
            css: "http://localhost:8080/css/forms/login.css",
            js: "http://localhost:8080/js/login.js"
        });
    };
};