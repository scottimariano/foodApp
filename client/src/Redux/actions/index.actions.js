export const GET_ALL_RECIPES = 'GET_ALL_RECIPES';
export const GET_RECIPE_DETAIL = 'GET_RECIPE_DETAIL';
export const FIND_RECIPES = 'FIND_RECIPES';
export const CREATE_RECIPE = 'CREATE_RECIPE';
export const SORT_RECIPES_ASCENDANT = 'SORT_RECIPES_ASCENDANT';
export const SORT_RECIPES_DESCENDANT = 'SORT_RECIPES_DESCENDANT';
export const FILTER_RECIPES = 'FILTER_RECIPES';
export const GET_DIETS = 'GET_DIETS';
export const GET_TYPES = 'GET_TYPES';
export const SHOW_ALL = 'SHOW_ALL';
export const CLEAR_RECIPE_DETAIL = 'CLEAR_RECIPE_DETAIL';
export const DELETE_RECIPE = 'DELETE_RECIPE';

const axios = require('axios');

export const getAllRecipes = () => {
	return async function (dispatch) {
		return axios.get('/').then((response) => {
			dispatch({ type: GET_ALL_RECIPES, payload: response.data });
		});
	};
};

export const findRecipes = (name) => {
	return async function (dispatch) {
		return axios
			.get(`/recipes/?name=${name}`)
			.then((response) => {
				dispatch({ type: FIND_RECIPES, payload: response.data });
			})
			.catch(() => {
				dispatch(getAllRecipes());
				alert('No se encontraron recetas con el texto buscado');
			});
	};
};

export const getRecipeDetail = (id) => {
	return async function (dispatch) {
		return axios
			.get(`/recipes/${id}`)
			.then((response) => {
				dispatch({ type: GET_RECIPE_DETAIL, payload: response.data });
			})
			.catch(() => {
				//redireccionar a home
				alert('No se encontraron recetas con el id buscado');
			});
	};
};

export const sortRecipesAscendant = (by, sort) => {
	return async function (dispatch) {
		dispatch({ type: SORT_RECIPES_ASCENDANT, payload: { by, sort } });
	};
};
export const sortRecipesDescendant = (by, sort) => {
	return async function (dispatch) {
		dispatch({ type: SORT_RECIPES_DESCENDANT, payload: { by, sort } });
	};
};
export const filterRecipes = (diet) => {
	return async function (dispatch) {
		dispatch({ type: FILTER_RECIPES, payload: diet });
	};
};
export const createRecipe = (input) => {
	return async function (dispatch) {
		return axios.post(`/recipes/`, input).then(
			(response) => {
				dispatch(getAllRecipes());
				alert(response.data);
			},

			(error) => {
				alert(error.response.data);
			}
		);
	};
};

export const getAsoc = (input) => {
	return async function (dispatch) {
		return axios
			.get(`/asoc`, input)
			.then(
				(response) => {
					dispatch({ type: GET_DIETS, payload: response.data[0] });
					dispatch({ type: GET_TYPES, payload: response.data[1] });
				},
				(error) => {
					alert(error.response.data);
				}
			)
			.then(dispatch(getAllRecipes()));
	};
};

export const showAllRecipes = () => {
	return async function (dispatch) {
		dispatch({ type: SHOW_ALL });
	};
};

export const clearRecipeDetail = () => {
	return async function (dispatch) {
		dispatch({ type: CLEAR_RECIPE_DETAIL });
	};
};

export const deleteRecipe = (id) => {
	return async function (dispatch) {
		return axios
			.delete(`/recipes/${id}`)
			.then((response) => {
				dispatch({ type: DELETE_RECIPE, payload: response.data });
				alert(response.data);
				dispatch(getAllRecipes());
			})
			.catch((e) => {
				alert(e.message);
			});
	};
};
