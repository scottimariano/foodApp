const { use } = require('chai');
const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		'recipe',
		{
			key: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			id: {
				type: DataTypes.VIRTUAL,
				get() {
					return `${this.key}DB`;
				},
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			image: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue(
						'image',
						val ||
							'https://img.freepik.com/vector-premium/logotipo-mascota-chef_138200-20.jpg?w=200'
					);
				},
			},
			summary: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			healthScore: { type: DataTypes.INTEGER, allowNull: true },
			instructions: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			readyInMinutes: {
				type: DataTypes.INTEGER,
			},
		},
		{ timestamps: false }
	);
};
