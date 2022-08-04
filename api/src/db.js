require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, PORT } = process.env;

let sequelize =
	process.env.NODE_ENV === 'production'
		? new Sequelize({
				database: DB_NAME,
				dialect: 'postgres',
				host: DB_HOST,
				port: PORT,
				username: DB_USER,
				password: DB_PASSWORD,
				pool: {
					max: 3,
					min: 1,
					idle: 10000,
				},
				dialectOptions: {
					ssl: {
						require: true,
						rejectUnauthorized: false,
					},
					keepAlive: true,
				},
				ssl: true,
		  })
		: new Sequelize(
				`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
				{ logging: false, native: false }
		  );

// const sequelize = new Sequelize(
// 	`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`,
// 	{
// 		logging: false, // set to console.log to see the raw SQL queries
// 		native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// 	}
// );
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
	.filter(
		(file) =>
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js'
	)
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
	entry[0][0].toUpperCase() + entry[0].slice(1),
	entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Recipe, Diet, DishType } = sequelize.models;

//cargamos las dietas en una primera instancia:
async function loadDiets() {
	const diets = [
		'gluten free',
		'vegetarian',
		'ketogenic',
		'lacto ovo vegetarian',
		'vegan',
		'pescatarian',
		'paleolithic',
		'primal',
		'dairy free',
		'fodmap friendly',
		'whole30',
	];

	diets.map((d) =>
		Diet.findOrCreate({
			where: { name: d },
		})
	);
	return Promise.all(diets);
}

async function loadTypes() {
	const types = [
		'main course',
		'side dish',
		'dessert',
		'appetizer',
		'salad',
		'bread',
		'breakfast',
		'soup',
		'beverage',
		'sauce',
		'marinade',
		'fingerfood',
		'snack',
		'drink',
	];

	types.map((d) =>
		DishType.findOrCreate({
			where: { name: d },
		})
	);
	return Promise.all(types);
}

Promise.all([loadDiets(), loadTypes()]).then(
	(response) => {
		console.log('Diets y types loaded OK');
	},
	(e) => console.log(e.message)
);

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Diet.belongsToMany(Recipe, { through: 'recipes_diets' });
Recipe.belongsToMany(Diet, { through: 'recipes_diets' });
DishType.belongsToMany(Recipe, { through: 'recipes_types' });
Recipe.belongsToMany(DishType, { through: 'recipes_types' });

module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
	Op,
};
