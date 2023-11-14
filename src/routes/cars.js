//Librerias externas
const express = require('express');
const router = express.Router()
const fs = require('fs');
const PDFDocument = require('pdfkit');

//Modulos internas
const {models} = require('../libs/sequelize');

const LOG_FILE_NAME = 'access_log.txt';

//PDF CARROS
router.get('/generate-pdf/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Obtener datos del carro con el ID especificado
        const car = await models.Car.findByPk(id);

        if (!car) {
            return res.status(404).send('Carro no encontrado');
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Configurar el estilo del documento PDF
        doc.font('Helvetica-Bold');
        doc.fontSize(20).text(`Detalles del Carro #${id}`, { align: 'center' });
        doc.moveDown();

        doc.font('Helvetica');
        // Agregar datos del carro al PDF
        doc.fontSize(14).text(`Marca: ${car.marca}`);
        doc.moveDown();
        doc.fontSize(14).text(`Línea: ${car.linea}`);
        doc.moveDown();
        doc.fontSize(14).text(`Modelo: ${car.modelo}`);
        doc.moveDown();
        doc.fontSize(14).text(`Color: ${car.color}`);
        doc.moveDown();
        doc.fontSize(14).text(`Fecha de Compra: ${car.compra}`);
        doc.moveDown();
        // Agrega más campos según sea necesario

        // Añadir un espacio en blanco al final del documento
        doc.moveDown();

        // Agregar una línea de separación
        doc.lineCap('butt').moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        // Finalizar el documento PDF
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno del servidor al generar el PDF.');
    }
});

module.exports = router;


//WEB LISTAR CARROS
router.get('/', async (req, res) => {
    //const data = readFile(FILE_NAME);
    const data = await models.Car.findAll();
    const filtro = req.query.filtro;

    if (filtro) {
        // Filtrar registros por la clave y valor especificados en el query param
        const filtroMayusculas = filtro.toUpperCase();
        const registrosFiltrados = data.filter((registro) => {
            const RegistroMayusculas = registro.marca.toUpperCase();
            return RegistroMayusculas.includes(filtroMayusculas); // Cambia "tipo" al nombre de la clave que quieras filtrar
        });
        res.render('carros/index', { carros: registrosFiltrados });
      } else {
        // Si no se proporciona un valor para el query param, enviar todos los registros
        //res.json(data);
        res.render('carros/index', { carros: data });
      }

    const currentTime = new Date().toISOString();
    const logEntry = `${currentTime} [GET] ListarCarros /carros`;
    
    fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro.', err);
        }
    });
});


//WEB CREAR CARRO
router.get('/create', (req,res) =>{
    //Mostrar el formulario
    res.render('carros/create');
})

router.post('/', async (req,res) =>{
    try{
        //Leer el archivo de carros
        //const data = readFile(FILE_NAME);
    
        //Agregar el nuevo registro
        //const newCar = req.body;
        //newCar.id = uuidv4();
        //console.log(newCar)
        //data.push(newCar); //agrego nuevo elemento
        //Escribir en el archivo
        //writeFile(FILE_NAME, data);
        const newCar = await models.Car.create(req.body)
        res.redirect('/cars')
    } catch (error){
            console.error(error);
            res.json({message: ' Error al almacenar el carro'});
        }

        const currentTime = new Date().toISOString();
        const logEntry = `${currentTime} [POST] CrearCarro /carros`;
        
        fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de registro.', err);
            }
        });
});

//WEB ELIMINAR CARRO
router.post('/:id', async (req, res) => {
    try {
        //GUARDAR ID
        const id = req.params.id;
        // BUSCAR EL CARRO CON EL ID QUE RECIBE Y ELIMINARLO
        await models.Car.destroy({
            where: {
                id: id
            }
        });

        // Redirigir después de completar la eliminación
        res.redirect('/cars');

        const currentTime = new Date().toISOString();
        const logEntry = `${currentTime} [DELETE] EliminarCarro /carros/Delete/id: `;
        
        fs.appendFile(LOG_FILE_NAME, logEntry + id + '\n', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de registro.', err);
            }
        });
        
    } catch (error) {
        console.error('Error al eliminar el carro:', error);
        res.status(500).send('Error interno del servidor al eliminar el carro.');
    }


});


module.exports = router;