const { Router, response } = require('express');
const axios = require('axios'); // importamos axios para hacer las request a la API

require('dotenv').config(); // requerimos las variables de entorno para poder utilizarlas
const { API_KEY } = process.env; //hacemos destructuring para asignarsela a la variable API_KEY

const { Op, Recipe, Diet, DishType } = require('../db.js'); // Importamos los modelos de la BD para poder utilizarlo

const { shortenResponse, propsToDiets } = require('../utils');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('', async (req, res) => {
	let allRecipes = [];
	try {
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
		]).then((response) => {
			allRecipes = [...response[0], ...response[1]];
			allRecipes.sort((a, b) => {
				// ordena alfabeticamente todas las recetas.

				return a.title.toLowerCase() <= b.title.toLowerCase() ? -1 : 1;
			});
			res.send(allRecipes);
		});
	} catch (error) {
		res.send(error.message);
	}
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
				return res.send(response);
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
		if (!title || !summary) {
			return res.status(404).send('Falta enviar datos obligatorios');
		} else {
			if (image === '') {
				image =
					'https://img.favpng.com/2/19/19/recipe-soup-chef-cooking-clip-art-png-favpng-Geqqry8pxNWaJc0CaAm4b38sM_t.jpg';
			}
			const newRecipe = await Recipe.create({
				title,
				image,
				summary,
				healthScore,
				instructions,
				readyInMinutes,
			});

			if (diets && diets.length > 0) {
				let dietsToPromises = diets.map(async (d) => {
					let dietToAdd = await Diet.findOne({ where: { name: d } });
					dietToAdd.addRecipe(newRecipe);
				});
				await Promise.all(dietsToPromises);
			}
			if (dishTypes && dishTypes.length > 0) {
				let typesToPromises = dishTypes.map(async (t) => {
					let typeToAdd = await DishType.findOne({ where: { name: t } });
					typeToAdd.addRecipe(newRecipe);
				});
				await Promise.all(typesToPromises);
			}
			return res.status(201).send('La receta fue creada satisfactoriamente');
		}
	} catch (error) {
		return res.status(404).send(error.message);
	}
});

// Obtener todos los tipos de Diet posibles
router.get('/asoc', async (req, res) => {
	async function loadDiets() {
		const diets = [
			'gluten free',
			'vegetarian',
			'ketogenic',
			'lacto-vegetarian',
			'ovo-vegetarian',
			'vegan',
			'pescatarian',
			'paleolithic',
			'primal',
			'low fodmap',
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

	return Promise.all([loadDiets(), loadTypes()]).then(
		(response) => res.send(response),
		(e) => res.status(404).send(e.message)
	);
});

module.exports = router;
