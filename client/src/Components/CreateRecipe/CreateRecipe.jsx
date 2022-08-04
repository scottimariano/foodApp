import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRecipe } from '../../Redux/actions/index.actions';
import { useHistory, Link } from 'react-router-dom';
import createRecipes from '../CreateRecipe/createRecipes.module.css';

const CreateRecipe = () => {
	const [input, setInput] = useState({
		title: '',
		image: '',
		dishTypes: [],
		summary: '',
		healthScore: 0,
		instructions: '',
		diets: [],
		readyInMinutes: 0,
	});
	const [errors, setErrors] = useState({ clear: true });
	const [dietsTemp, setdietsTemp] = useState([]);
	const [dishTypesTemp, setdishTypesTemp] = useState([]);
	const diets = useSelector((state) => state.diets);
	const dishTypes = useSelector((state) => state.dishTypes);
	const dispatch = useDispatch();
	const history = useHistory();
	let optionDietsRef = useRef();
	let optionDishTypesRef = useRef();

	function formValidation(input) {
		let errors = { clear: false };
		if (!input.title) {
			errors.title = 'required field';
			errors.clear = true;
		} else {
			if (!/^[a-zA-Z ]+$/g.test(input.title)) {
				errors.title = `Can't contains numbers`;
				errors.clear = true;
			}
		}
		if (!input.summary) {
			errors.summary = 'required field';
			errors.clear = true;
		}
		if (input.healthScore > 100 || input.healthScore < 0) {
			errors.healthScore = 'must be between 0 and 100 ';
			errors.clear = true;
		}

		return errors;
	}

	function handleChangeForm(e) {
		setErrors(
			formValidation({
				...input,
				[e.target.name]: e.target.value,
			})
		);
		setInput({
			...input,
			[e.target.name]: e.target.value,
		});
	}

	function handleChangeDiets(e) {
		var selected = [];

		for (let option of [...optionDietsRef.current.options]) {
			if (option.selected) {
				selected.push(option.value);
			}
		}
		setdietsTemp(selected);
	}

	function handleChangeDishTypes(e) {
		var selected = [];

		for (let option of [...optionDishTypesRef.current.options]) {
			if (option.selected) {
				selected.push(option.value);
			}
		}
		setdishTypesTemp(selected);
	}

	function handleSubmit(e) {
		e.preventDefault();
		let response = input;
		response.diets = dietsTemp;
		response.dishTypes = dishTypesTemp;
		dispatch(createRecipe(response));
		setInput({
			title: '',
			image: '',
			dishTypes: [],
			summary: '',
			healthScore: 0,
			instructions: '',
			diets: [],
			readyInMinutes: 0,
		});
		setdietsTemp([]);
		setdishTypesTemp([]);
		history.push('/');
	}

	return (
		<div>
			<div className={`${createRecipes.canvas}`}>
				<div className={`${createRecipes.navBar}`}>
					<Link
						to={'/'}
						style={{ textDecoration: 'none', color: 'black' }}>
						<div className={`${createRecipes.logo}`}>
							<h1 className={`${createRecipes.logo}`}>
								- RECIPE TOWN -
							</h1>
							<p className={`${createRecipes.logo}`}>
								{' '}
								- Discover your next desire -
							</p>
						</div>
					</Link>
				</div>
				<form onSubmit={handleSubmit}>
					<div className={`${createRecipes.form}`}>
						<div
							className={`${createRecipes.formCol} ${createRecipes.formCol1}`}>
							<label>Title: </label>
							{!errors.title ? (
								<p className={`${createRecipes.error}`}></p>
							) : (
								<p className={`${createRecipes.error}`}>
									{errors.title}
								</p>
							)}
							<input
								name="title"
								value={input.title}
								required
								onChange={handleChangeForm}
								onBlur={handleChangeForm}></input>
							<label>Summary: </label>
							{!errors.summary ? (
								<p className={`${createRecipes.error}`}></p>
							) : (
								<p className={`${createRecipes.error}`}>
									{errors.summary}
								</p>
							)}
							<textarea
								name="summary"
								cols="30"
								rows="10"
								required
								value={input.summary}
								onChange={handleChangeForm}
								onBlur={handleChangeForm}></textarea>
							<div className={`${createRecipes.numberInput}`}>
								{!errors.healthScore ? (
									<p className={`${createRecipes.error}`}></p>
								) : (
									<p className={`${createRecipes.error}`}>
										{errors.healthScore}
									</p>
								)}
								<label>Health Score: </label>
								<input
									type="number"
									name="healthScore"
									value={input.healthScore}
									onChange={handleChangeForm}
									onBlur={handleChangeForm}
									min="0"
									max="100"
								/>
							</div>
							<div className={`${createRecipes.numberInput}`}>
								<label>Ready in (minutes): </label>
								<input
									type="number"
									name="readyInMinutes"
									value={input.readyInMinutes}
									onChange={handleChangeForm}
									onBlur={handleChangeForm}
									min="0"
								/>
							</div>
						</div>
						<div
							className={`${createRecipes.formCol} ${createRecipes.formCol2}`}>
							<label>Image URL: </label>
							<input
								name="image"
								value={input.image}
								placeholder="Ingrese la URL de la imagen"
								onChange={handleChangeForm}
								onBlur={handleChangeForm}
							/>
							<label>Instructions: </label>
							<textarea
								name="instructions"
								cols="30"
								rows="10"
								value={input.instructions}
								onChange={handleChangeForm}
								onBlur={handleChangeForm}></textarea>
							<div>
								<label className={`${createRecipes.dietLabel}`}>
									Diet Types:{' '}
								</label>
								<select
									ref={optionDietsRef}
									id="diets"
									name="diets"
									multiple="multiple"
									onChange={(e) => {
										handleChangeDiets(e);
										handleChangeForm(e);
									}}
									onBlur={(e) => {
										handleChangeDiets(e);
										handleChangeForm(e);
									}}>
									{diets.map((d, index) => (
										<option key={index} value={d.name}>
											{d.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className={`${createRecipes.dietLabel}`}>
									Dish Types:{' '}
								</label>
								<select
									ref={optionDishTypesRef}
									id="dishTypes"
									name="dishTypes"
									multiple="multiple"
									onChange={(e) => {
										handleChangeDishTypes(e);
										handleChangeForm(e);
									}}
									onBlur={(e) => {
										handleChangeDishTypes(e);
										handleChangeForm(e);
									}}>
									{dishTypes.map((d, index) => (
										<option key={index} value={d.name}>
											{d.name}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
					<div className={`${createRecipes.button}`}>
						<button type="submit" disabled={errors.clear}>
							<h4>CREATE RECIPE</h4>
						</button>
					</div>
				</form>
			</div>
			<Link className={`${createRecipes.backHome}`} to={'/'}>
				BACK TO HOME
			</Link>
		</div>
	);
};

export default CreateRecipe;
