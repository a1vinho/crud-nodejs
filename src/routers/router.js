import {Router} from "express";
import mysql from '../services/database.js';
import render from "../controllers/get.js";
import post from "../controllers/post.js";
import JWT from "../middlewares/jwt.js";
import actions from "../controllers/actions-tasks.js";

const router = Router();

router.get('/home',JWT,render.Home);
router.get('/register',render.Register);
router.get("/sessions",function(req,res) {
    return res.json(req.session);
});
router.get('/email/validated',JWT,async function(request,response) {
    const {username,email,password} = request.session;
    const [exists] = await mysql.query('SELECT * FROM users WHERE username = ? OR email = ?',[username,email]);

    if (exists) {
        return response.status(401).json({messagem: "Nome de usuario ou email já registrado"});
    };

    await mysql.query(`INSERT INTO users (username,email,password) VALUES (?,?,?)`,[username,email,password]);
    return response.status(301).redirect('/login');
});
router.get('/a',function(request,response) {
    request.session.teste = 'python';

    return response.redirect("/sessions");
});
router.get("/login",render.Login);
router.get("/tasks",JWT,async function(request,response) {
    const id = request.user.id;

    const tasks = (await mysql.query('SELECT * FROM tasks WHERE user_id = ?',id)).find(data => data);
    console.log(tasks)
    return response.status(200).json(tasks);
});

router.post('/register',post.Register);
router.post('/login',post.Login);
router.post("/create/task",JWT,actions.CreateTask);

router.put('/update/task',JWT,actions.UpdateTask);
router.put("/done/task",JWT,actions.DoneTask);

router.delete('/delete/task',JWT,actions.DeleteTask);
router.get('/logout',async function(request,response) {
    if (request.session.login) {
        await mysql.query(`INSERT INTO tokens (token) VALUES (?)`,request.session.login);
        request.session.login = undefined;
        return response.status(301).redirect("/login");
    };
    return response.status(301).redirect("/login");
});
export default router;