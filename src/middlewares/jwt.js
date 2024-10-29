import jwt from "jsonwebtoken";
import mysql from "../services/database.js";

export default async function(request,response,next) {
    const token = request.header["Authorization"] || request.query.token;

    if (!token) {
        return response.status(401).json({messagem: "Token invalído"});
    };

    const [exists] = (await mysql.query(`SELECT * FROM tokens WHERE token = ?`,token)).find(data => data);

    if (exists) {
        return response.status(401).json({messagem: "Token invalído"});
    };

    jwt.verify(token,process.env.SECRET,async function(err,data) {
        if (err) {
            console.log(err);
            return response.status(500).json({messagem: "Erro no serviodor,tente novamente mais tarde."});
        };

        request.user = data;
        request.token = token;
        
        next();
    });
};