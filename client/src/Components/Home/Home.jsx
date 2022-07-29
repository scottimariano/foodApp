import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Cards from '../Cards/Cards';
import {
	filterRecipes,
	findRecipes,
	sortRecipesAscendant,
	sortRecipesDescendant,
	showAllRecipes,
	getAllRecipes,
} from '../../Redux/actions/index.actions';
import home from './home.module.css';

const Home = (props) => {
	const [input, setInput] = useState('');
	const [dietFilter, setdietFilter] = useState('Filter by Diet Type');
	const dispatch = useDispatch();
	const sort = useSelector((state) => state.sort);

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(findRecipes(input));
		setInput('');
	}

	function sortBy(value) {
		switch (value) {
			case 'AZ':
				dispatch(sortRecipesAscendant('title', value));
				break;
			case 'ZA':
				dispatch(sortRecipesDescendant('title', value));
				break;
			case '1-100':
				dispatch(sortRecipesAscendant('healthScore', value));
				break;
			case '100-1':
				dispatch(sortRecipesDescendant('healthScore', value));
				break;

			default:
				break;
		}
	}

	function handleFilter(diet) {
		setdietFilter(diet);
		if (diet === 'Show All') {
			dispatch(showAllRecipes());
			setdietFilter('Filter by Diet Type');
		} else dispatch(filterRecipes(diet));
	}

	function handleShowAll() {
		dispatch(getAllRecipes());
	}

	return (
		<div className={`${home.canvas}`}>
			<div className={`${home.navBar}`}>
				<div className={`${home.logo}`}>
					<h1 className={`${home.logo}`}>- RECIPE TOWN -</h1>
					<p className={`${home.logo}`}> - Discover your next desire -</p>
				</div>
				<section className={`${home.searchBar}`}>
					<form onSubmit={(e) => handleSubmit(e)}>
						<input
							type="text"
							placeholder="Search by title..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<input
							className={`${home.inButton}`}
							type="submit"
							value="BUSCAR"
						/>
					</form>
					<button
						className={`${home.inButton}`}
						onClick={() => handleShowAll()}>
						Show All
					</button>
				</section>

				<section className={`${home.filters}`}>
					<div>
						<select
							id="sortSelect"
							value={sort}
							onChange={(e) => sortBy(e.target.value)}>
							<option value={'AZ'}>Sort by Title: A-Z</option>
							<option value={'ZA'}>Sort by Title: Z-A</option>
							<option value={'1-100'}>
								Sort by Health Score: 1 - 100
							</option>
							<option value={'100-1'}>
								Sort by Health Score: 100 - 1
							</option>
						</select>
					</div>
					<div>
						<select
							id="filter"
							name="diets"
							value={dietFilter}
							onChange={(e) => handleFilter(e.target.value)}>
							<option value="Filter by Diet Type" disabled hidden>
								Filter by Diet Type
							</option>
							<option value="Show All">Show All</option>
							<option value="gluten free">Gluten Free</option>
							<option value="vegetarian">Vegetarian</option>
							<option value="lacto-vegetarian">Lacto-Vegetarian</option>
							<option value="ovo-vegetarian">Ovo-Vegetarian</option>
							<option value="vegan">Vegan</option>
							<option value="pescetarian">Pescetarian</option>
							<option value="paleo">Paleo</option>
							<option value="primal">Primal</option>
							<option value="low fodmap">Low FODMAP</option>
							<option value="whole30">Whole30</option>
							<option value="ketogenic">Ketogenic</option>
						</select>
					</div>
				</section>
			</div>
			<Cards />
			<Link className={`${home.createRecipeButton}`} to={'/createRecipe'}>
				CREATE NEW RECIPE
			</Link>
		</div>
	);
};

export default Home;
