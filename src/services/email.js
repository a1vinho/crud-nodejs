import nodemailer from "nodemailer";
export default function(email,token) {

    const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAILPASS 
    }
    });
    return new Promise((resolve,reject) => {
        transporter.sendMail({
                from: process.env.EMAIL, 
                to: email, 
                subject: `Token de verificação`, 
                text: `Seu token de verificação ${token}`, 
                // html: "<b>Mensagem em HTML</b>" // Mensagem em HTML, se desejado
        },(err,info) => {
            if (err) return reject({messagem: "Erro no servidor,tente novmamente mais tarde.",status:500});

            return resolve({messagem: "Enviamos um token de verificação para o seu email",status:200});
        });
    });
};