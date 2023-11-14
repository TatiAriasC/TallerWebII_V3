//Librerias externas
const express = require('express');
const router = express.Router();
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

//Modulos internas
const { readFile, writeFile } = require('../files');
const FILE_NAME = './db/carros.txt';
const LOG_FILE_NAME = 'access_log.txt';

//API
//Listar Carros
router.get('/', (req,res) =>{
    
    const data = readFile(FILE_NAME);
    const filtro = req.query.filtro;

    if (filtro) {
        // Filtrar registros por la clave y valor especificados en el query param
        const registrosFiltrados = data.filter((registro) => {
          return registro.marca.includes(filtro); // Cambia "tipo" al nombre de la clave que quieras filtrar
        });
    
        res.json(registrosFiltrados);
      } else {
        // Si no se proporciona un valor para el query param, enviar todos los registros
        res.json(data);
      }

    const currentTime = new Date().toISOString();
    const logEntry = `${currentTime} [GET] ListarCarrosAPI /carros`;
    
    fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro.', err);
        }
    });
});


//Crear carro
router.post('/', (req, res) => {
    try{
    //Leer el archivo de mascotas
    const data = readFile(FILE_NAME);

    //Agregar el nuevo carro
    const newCar = req.body;
    newCar.id = uuidv4();
    console.log(newCar)
    data.push(newCar); //agrego nuevo elemento
    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'El carro fue creado'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar el registro'});
    }

});

//Obtener un solo carro (usamos los dos puntos por que es un path param)
router.get('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const cars = readFile(FILE_NAME)

    //BUSCAR EL CARRO CON EL ID QUE RECIBE
    const petFound = cars.find(carro => carro.id === id)
    if(!petFound){
        res.status(404).json({'ok': false, message:"Car not found"})
        return;
    }

    res.json({'ok': true, pet: petFound});
})

//ACTUALIZAR UN DATO
router.put('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const cars = readFile(FILE_NAME)

    //BUSCAR EL CARRO CON EL ID QUE RECIBE
    const carIndex = cars.findIndex(car => car.id === id)
    if(carIndex < 0){
        res.status(404).json({'ok': false, message:"Car not found"})
        return;
    }
    let car = cars[carIndex]; //sacar del arreglo
    car={...car, ...req.body}
    cars[carIndex] = car //Poner EL CARRO en el mismo lugar
    writeFile(FILE_NAME, cars);
    //SI EL CARRO EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE
    res.json({'ok': true, car: car});
})

//Delete, eliminar un dato
router.delete('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const cars = readFile(FILE_NAME)

    //BUSCAR EL CARRO CON EL ID QUE RECIBE
    const carIndex = cars.findIndex(car => car.id === id)
    if(carIndex < 0){
        res.status(404).json({'ok': false, message:"Car not found"})
        return;
    }
    //eliminar el carro en la posicion
    cars.splice(carIndex,1);
    writeFile(FILE_NAME, cars)
    res.json({'ok': true});
})

module.exports = router;