import jwt from "jsonwebtoken";
import mysql from "../services/database.js";



export default class {
    static async CreateTask(request,response) {
        const {title,description} = request.body;
        
        if (!title) {
            return response.status(400).json({messagem: "Digite um títlo para sua tarefa"});
        };  
        await mysql.query(`INSERT INTO tasks (title,description,date,done,user_id) VALUES (?,?,?,?,?)`,[
            title,description,Date.now(),false,request.user.id
        ]);
        return response.status(301).redirect(`/home?token=${request.session.login}`);
    };
    static async UpdateTask (request,response) {
        const id = request.query.id;
        if (!id) {
            return response.status(401).json({messagem: "Task não encontrada"});
        };
        const {title,description} = request.body;
        if (!title) {
            return response.status(401).json({messagem: "Titulo invalído"});
        };

        await mysql.query(`UPDATE tasks SET title = ?,description = ? WHERE id = ?`,[title,description,id]);

        return response.status(301).redirect(`/home?token=${request.session.login}`);
    };
    static async DeleteTask(request,response) {
        const id = request.query.id;

        if (!id) {
            return response.status(401).json({messagem: "Task não encontrada"});
        };

        await mysql.query(`DELETE FROM tasks WHERE id = ?`,id);

        return response.status(301).redirect(`/home?token=${request.session.login}`);
    }

    static async DoneTask(request,response) {
        const id = request.query.id;

        if (!id) {
            return response.status(401).json({messagem: "Task não encontrada"});
        };

        await mysql.query('UPDATE tasks SET done = ? WHERE Id = ?',[true,id]);

        return response.status(301).redirect(`/home?token=${request.session.login}`);
    };
};