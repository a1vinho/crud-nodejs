import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import router from "../routers/router.js";
import {configDotenv} from "dotenv";
configDotenv();

const app = express();
const hbs = exphbs.create({
    helpers: {
        formatDate:function(date) {
            const day = new Date(+date).getDate();
            let month = new Date(+date).getMonth();
            const year = new Date(+date).getFullYear();
            
            switch (month) {
                case 0: month = 'Janeiro'
                case 1: month = 'Fevereiro'
                case 2 : month = 'Março'
                case 3: month = 'Abril'
                case 4: month = "Maio"
                case 5: month = "Junho"
                case 6: month = "Julho"
                case 7: month = "Agosto"
                case 8: month = 'Setembro'
                case 9: month = "Outubro"
            }
            const format = `Criada em ${day} de ${month} de ${year}`;
        
            return format;
        }
    }
});

app.use(express.json());


app.set('view engine','handlebars');
app.engine('handlebars',hbs.engine);

app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: {
        secure:false,
        httpOnly:true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.static('src/public'));
app.use(router);

export default app;