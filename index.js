//Librerias externas
const express = require('express');

//Modulos internas
const { readFile, writeFile } = require('./src/files');
const cars_api = require ('./src/routes/cars_api');
const cars =  require ('./src/routes/cars');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const FILE_NAME = './db/carros.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list = ['Juan', 'Pablo', 'Lucas']
    //res.send(`Hello ${formal ? 'Mr.' : ''} 
    //${name} ${type ? ' ' + type : ''}`);
    res.render('index',{
        name : name,
        students : students_list,
    })

});

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})


app.use('/api/cars', cars_api);
app.use('/cars', cars);
app.use('/cars/generate-pdf/:id', cars);
app.use('/cars/:id', cars);

app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});