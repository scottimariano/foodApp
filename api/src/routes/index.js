const { Router, response } = require('express');
const axios = require('axios'); // importamos axios para hacer las request a la API

require('dotenv').config(); // requerimos las variables de entorno para poder utilizarlas
const { API_KEY } = process.env; //hacemos destructuring para asignarsela a la variable API_KEY

const { Op, Recipe, Diet, DishType } = require('../db.js'); // Importamos los modelos de la BD para poder utilizarlo

const { shortenResponse, propsToDiets } = require('../utils');
const e = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/', async (req, res) => {
	let allRecipes = [];
	Promise.all([
		//Cargar recetas APi
		axios
			.get(
				`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
			)
			.then((response) => {
				let shortResponse = response.data.results.map((recipe) => {
					propsToDiets(recipe);
					return shortenResponse(recipe);
				});
				return shortResponse;
			})
			.catch((error) => {
				console.log(
					'Error en la obtencion de datos de la API: ' + error.message
				);
				return [];
			}),
		//Cargar recetas DB
		Recipe.findAll({
			include: [
				{
					model: Diet,
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
				{
					model: DishType,
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
			],
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				console.log(
					'Error en la obtencion de datos de la BD: ' + error.message
				);
				return [];
			}),
	]).then(
		(response) => {
			allRecipes = [...response[0], ...response[1]];
			allRecipes.sort((a, b) => {
				// ordena alfabeticamente todas las recetas.
				return a.title.toLowerCase() <= b.title.toLowerCase() ? -1 : 1;
			});
			res.send(allRecipes);
		},
		(error) => res.send(404).send(error.message)
	);
});

// Obtener un listado de las recetas que contengan la palabra ingresada como query parameter
router.get('/recipes', async (req, res) => {
	const { name } = req.query;
	let filteredRecipes = [];

	if (name) {
		Promise.all([
			// busqueda de los datos desde la api
			axios
				.get(
					`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=5&titleMatch=${name}`
				)
				.then((response) => {
					let shortResponse = response.data.results.map((recipe) => {
						propsToDiets(recipe);
						return shortenResponse(recipe);
					});

					return shortResponse;
				})
				.catch((error) => {
					console.log(
						'Error en la obtencion de datos de la API: ' + error.message
					);
					return [];
				}),

			//busqueda de los datos desde la BD

			Recipe.findAll({
				include: [
					{
						model: Diet,
						attributes: ['name'],
						through: {
							attributes: [],
						},
					},
					{
						model: DishType,
						attributes: ['name'],
						through: {
							attributes: [],
						},
					},
				],
				where: {
					title: {
						[Op.iLike]: `%${name}%`,
					},
				},
			}).catch((error) => {
				console.log(
					'Error en la obtencion de datos de la BD: ' + error.message
				);
				return [];
			}),
		])
			.then((response) => {
				if (!response[0].length && !response[1].length) {
					return res
						.status(404)
						.send(
							'No se encontraron recetas que contengan el texto buscado'
						);
				}

				filteredRecipes = [...response[0], ...response[1]];
				filteredRecipes.sort((a, b) => {
					// ordena alfabeticamente todas las recetas.
					return a.title.toLowerCase() <= b.title.toLowerCase() ? -1 : 1;
				});
				return res.send(filteredRecipes);
			})
			.catch((error) => {
				return res.send(error.message);
			});
	}
});

// Obtener el detalle de una receta en particular
router.get('/recipes/:id', async (req, res) => {
	const { id } = req.params;
	if (/^\d+(DB)$/g.test(id)) {
		Recipe.findOne({
			include: [
				{
					model: Diet,
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
				{
					model: DishType,
					attributes: ['name'],
					through: {
						attributes: [],
					},
				},
			],
			where: {
				key: {
					[Op.eq]: parseInt(id.split('DB')[0]),
				},
			},
		})
			.then((response) => {
				!response
					? res.status(404).send('Recipe Not found')
					: res.send(response);
			})
			.catch((error) => {
				return res
					.status(404)
					.send('Error en la obtencion de datos de la BD');
			});
	} else if (/^\d+$/g.test(id)) {
		axios
			.get(
				`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
			)
			.then((response) => {
				propsToDiets(response.data);
				return res.send(shortenResponse(response.data));
			})
			.catch((error) => {
				return res
					.status(404)
					.send('Error en la obtencion de datos de la API');
			});
	} else {
		return res.status(404).send('Revise los parametros de busqueda');
	}
});

// Recibe los datos recolectados desde el formulario controlado de la ruta de creación de recetas por body
router.post('/recipes', async (req, res) => {
	//console.log(req.body);
	let {
		title,
		image,
		diets,
		dishTypes,
		summary,
		healthScore,
		instructions,
		readyInMinutes,
	} = req.body;
	try {
		if (!title && !summary) {
			return res
				.status(404)
				.send('Creating new recipe requires title and summary');
		} else {
			const newRecipe = await Recipe.create({
				title,
				image,
				summary,
				healthScore,
				instructions,
				readyInMinutes,
			});

			if (diets.length > 0) {
				const dietsToPromises = await Diet.findAll({
					where: { name: { [Op.or]: diets } },
				});
				await newRecipe.addDiets(dietsToPromises);
			}
			if (dishTypes.length > 0) {
				const typesToPromises = await DishType.findAll({
					where: { name: { [Op.or]: dishTypes } },
				});
				await newRecipe.addDishTypes(typesToPromises);
				// let typesToPromises = dishTypes.map(async (t) => {
				// 	let typeToAdd = await DishType.findOne({ where: { name: t } });
				// 	typeToAdd.addRecipe(newRecipe);
				// });
				// await Promise.all(typesToPromises);
			}
			return res.status(201).send('Recipe was succesfully created');
		}
	} catch (error) {
		return res.status(404).send(error.message);
	}
});

// Obtener todos los tipos de Diet posibles
router.get('/asoc', async (req, res) => {
	Promise.all([
		Promise.all(await Diet.findAll()),
		Promise.all(await DishType.findAll()),
	]).then((response) => res.send(response));
});

router.delete('/recipes/:id', async (req, res) => {
	const { id } = req.params;
	Recipe.findOne({
		where: {
			key: {
				[Op.eq]: parseInt(id.split('DB')[0]),
			},
		},
	})
		.then((response) => {
			if (response) {
				response.destroy().then((r) => {
					res.send(`Se ha borrado la receta con ID: ${id}`);
				});
			} else {
				res.status(404).send(`No se ha encontrado la receta con ID: ${id}`);
			}
		})
		.catch((e) => console.log(e.message));
});

// router.put('/recipes/:id', async (req, res) => {
// 	const { id } = req.params;
// 	let {
// 		title,
// 		image,
// 		diets,
// 		dishTypes,
// 		summary,
// 		healthScore,
// 		instructions,
// 		readyInMinutes,
// 	} = req.body;

// 	Recipe.findOne({
// 		where: {
// 			key: {
// 				[Op.eq]: parseInt(id.split('DB')[0]),
// 			},
// 		},
// 	})
// 		.then((response) => {
// 			response.set({
// 				title,
// 				image,
// 				summary,
// 				healthScore,
// 				instructions,
// 				readyInMinutes,
// 			});

// 			response.save().then((response) => {
// 				const recipeUpdated = response;
// 				Promise.all([
// 					Diet.findAll({
// 						where: { name: { [Op.or]: diets } },
// 					}).then((response) => recipeUpdated.setDiets(response)),
// 					DishType.findAll({
// 						where: { name: { [Op.or]: dishTypes } },
// 					}).then((response) => recipeUpdated.setDishTypes(response)),
// 				]);
// 			});
// 		})
// 		.then(() => res.send('Receta modificada exitosamente'))

// 		.catch((e) =>
// 			res
// 				.status(404)
// 				.send('Ha ocurrido un error al intentar actualizar ' + e.message)
// 		);
//});

module.exports = router;
