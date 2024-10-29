import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import mysql from "../services/database.js";
import SendEmail from "../services/email.js";

export default class {
    static async Register(request,response) {
        const {username,email,password} = request.body;
        console.log(username,email,password);
        if (!username || !email || !password) {
            return response.status(401).json({messagem: "Suas credenciais estão invalídas."});
        };
        if (password.length < 8) {
            return response.status(401).json({messagem: "Sua senha precisa ter no minimo oito caracteres"});
        };
        try {

            const user = {
                username,
                email,
                password: await bcrypt.hash(password,10)
            };

            const token = jwt.sign({username},process.env.SECRET);

            const data = await SendEmail(email,`http://localhost:8080/email/validated?token=${token}`);

            request.session.username = username;
            request.session.email = email;
            request.session.password = user.password;

            return response.status(data.status).json({messagem: data.messagem});
        }
        catch (e) {
            console.log(e);
            return response.status(500).json({messagem: "Erro no servidor,tente novamente mais tarde."});
        };
    };
    static async Login (request,response) {
        try {
            const {username,password} = request.body;
            if (!username || !password) {
                return response.status(401).json({messagem: "Suas credenciais estão invalídas"});
            };

            const [exists] = (await mysql.query(`SELECT * FROM users WHERE username = ?`,username)).find(data => data);
            
            if (!exists) {
                return response.status(404).json({messagem: "Esse usuário não existe"});
            };
            const hash = await bcrypt.compare(password,exists.password);

            if (hash) {
                const token = jwt.sign({id:exists.id,username},process.env.SECRET);

                request.session.login = token;

                return response.status(200).json({token:request.session.login});
            };

            return response.status(401).json({messagem: "Senha incorreta"});
        }
        catch (e) {
            console.log(e);
        };
    };
};