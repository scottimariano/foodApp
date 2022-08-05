/* eslint-disable react-hooks/exhaustive-deps */
import { Route } from 'react-router-dom';
import './App.css';
import Landing from './Components/Landing/Landing';
import Home from './Components/Home/Home';
import RecipeDetail from './Components/RecipeDetail/RecipeDetail';
import React, { useEffect } from 'react';
import { getAsoc } from './Redux/actions/index.actions';
import { useDispatch } from 'react-redux';
import CreateRecipe from './Components/CreateRecipe/CreateRecipe';

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getAsoc());
	}, []);

	return (
		<>
			<Route exact path="/landing" component={Landing}></Route>
			<Route exact path="/" component={Home}></Route>
			<Route path="/recipes/:id" component={RecipeDetail}></Route>
			<Route path="/createRecipe" component={CreateRecipe}></Route>
		</>
	);
}

export default App;
