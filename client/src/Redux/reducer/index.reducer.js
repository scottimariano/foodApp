import {
	FIND_RECIPES,
	GET_ALL_RECIPES,
	GET_RECIPE_DETAIL,
	SORT_RECIPES_ASCENDANT,
	SORT_RECIPES_DESCENDANT,
	FILTER_RECIPES,
	GET_DIETS,
	GET_TYPES,
	SHOW_ALL,
} from '../actions/index.actions';

const initialState = {
	recipes: [],
	recipesToShow: [],
	recipeDetails: {},
	sort: 'A-Z',
	diets: [],
	dishTypes: [],
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_ALL_RECIPES:
			return {
				...state,
				recipes: action.payload,
				recipesToShow: action.payload,
			};

		case GET_RECIPE_DETAIL:
			return {
				...state,
				recipeDetails: action.payload,
			};

		case FIND_RECIPES:
			return {
				...state,
				recipes: action.payload,
				recipesToShow: action.payload,
				sort: 'A-Z',
			};

		case SORT_RECIPES_ASCENDANT:
			return {
				...state,
				recipesToShow: [
					...state.recipesToShow.sort((a, b) => {
						if (action.payload.by === 'healthScore') {
							return a[action.payload.by] <= b[action.payload.by]
								? -1
								: 1;
						} else {
							return a[action.payload.by].toString().toLowerCase() <=
								b[action.payload.by].toString().toLowerCase()
								? -1
								: 1;
						}
					}),
				],
				sort: action.payload.sort,
			};
		case SORT_RECIPES_DESCENDANT:
			return {
				...state,
				recipesToShow: [
					...state.recipesToShow.sort((a, b) => {
						if (action.payload.by === 'healthScore') {
							return a[action.payload.by] >= b[action.payload.by]
								? -1
								: 1;
						} else {
							return a[action.payload.by].toString().toLowerCase() >=
								b[action.payload.by].toString().toLowerCase()
								? -1
								: 1;
						}
					}),
				],
				sort: action.payload.sort,
			};
		case FILTER_RECIPES:
			return {
				...state,
				recipesToShow: [
					...state.recipesToShow.filter((recipe) => {
						if (/^\d+(DB)$/g.test(recipe.id)) {
							return recipe.diets.some(
								(diet) => diet.name === action.payload
							);
						} else {
							return recipe.diets.includes(action.payload);
						}
					}),
				],
				sort: action.payload.sort,
			};

		case GET_DIETS:
			return {
				...state,
				diets: action.payload,
			};
		case GET_TYPES:
			return {
				...state,
				dishTypes: action.payload,
			};

		case SHOW_ALL:
			return {
				...state,
				recipesToShow: state.recipes,
			};

		default:
			return { ...state };
	}
};

export default rootReducer;
