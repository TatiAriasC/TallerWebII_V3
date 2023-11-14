const {CarModel, carSchema} = require('./car.model');

function setUpModels (sequelize){
    CarModel.init(carSchema, CarModel.config(sequelize));

}

module.exports = setUpModels;