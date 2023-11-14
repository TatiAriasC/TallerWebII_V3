const {Model, DataTypes} = require('sequelize');

const CAR_TABLE = 'cars';

const carSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marca:{
        type: DataTypes.STRING,
        allowNull: false
    },
    linea:{
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    compra:{
        type: DataTypes.DATE,
        allowNull: false
    }
};

class CarModel extends Model{
    static associate(models){
        // this.belongsTo(models.UserModel, {foreignKey: 'user:id', as: 'User'});
    }

    static config(sequelize){ //envia la conexion a la base de datos
        return {
            sequelize,
            tableName: CAR_TABLE,
            modelName: 'Car',
            timestamps: false
        }
    }
}

module.exports = {CAR_TABLE, carSchema, CarModel};