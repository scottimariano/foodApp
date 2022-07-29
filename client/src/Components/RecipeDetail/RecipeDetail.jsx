import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipeDetail } from '../../Redux/actions/index.actions';
import recipeDetailclass from '../RecipeDetail/recipeDetail.module.css';
import clock from '../../media/clipart2085481-2.png';
import healthScore from '../../media/healthScore.png';

const RecipeDetail = (props) => {
	const dispatch = useDispatch();
	const recipeDetail = useSelector((state) => state.recipeDetails);

	useEffect(() => {
		dispatch(getRecipeDetail(props.match.params.id));
	}, []);

	return (
		<>
			<div className={`${recipeDetailclass.canvas}`}>
				<section className={`${recipeDetailclass.navBar}`}>
					<Link
						to={'/'}
						style={{ textDecoration: 'none', color: 'black' }}>
						<div className={`${recipeDetailclass.logo}`}>
							<h1 className={`${recipeDetailclass.logo}`}>
								- RECIPE TOWN -
							</h1>
							<p className={`${recipeDetailclass.logo}`}>
								{' '}
								- Discover your next desire -
							</p>
						</div>
					</Link>
				</section>
				<section className={`${recipeDetailclass.container}`}>
					<section className={`${recipeDetailclass.row1}`}>
						<div className={`${recipeDetailclass.title}`}>
							{!recipeDetail.title ? (
								<h2>Cargando...</h2>
							) : recipeDetail.title.length > 80 ? (
								<h2>{recipeDetail.title.slice(0, 80)} ...</h2>
							) : (
								<h2>{recipeDetail.title}</h2>
							)}
						</div>
						<aside className={`${recipeDetailclass.aside}`}>
							<div>
								<img
									className={`${recipeDetailclass.clock}`}
									src={clock}
									alt=""
								/>
								<p className={`${recipeDetailclass.clock}`}>
									ready in
									<br />
									{recipeDetail.readyInMinutes} minutes
								</p>
							</div>
							<div>
								<img
									className={`${recipeDetailclass.healthScore}`}
									src={healthScore}
									alt=""
								/>
								<p className={`${recipeDetailclass.healthScore}`}>
									Healt Score:
									<br />
									<b>{recipeDetail.healthScore}</b>
								</p>
							</div>
						</aside>

						<div className={`${recipeDetailclass.dishTypes}`}>
							{!recipeDetail.dishTypes ? (
								<p>No existen tipos de platos asociados</p>
							) : /^\d+(DB)$/g.test(recipeDetail.id) ? (
								recipeDetail.dishTypes.map((dishType, index) => (
									<div key={index}>{dishType.name}</div>
								))
							) : (
								recipeDetail.dishTypes.map((dishType, index) => (
									<div key={index}>{dishType}</div>
								))
							)}
						</div>
					</section>
					<section className={`${recipeDetailclass.row2}`}>
						<div className={`${recipeDetailclass.summary}`}>
							<p>Summary:</p>
							<p
								dangerouslySetInnerHTML={{
									__html: recipeDetail.summary,
								}}></p>
						</div>
						<div>
							<img src={recipeDetail.image} alt={recipeDetail.title} />
							<p>Diets:</p>
							{!recipeDetail.diets ? (
								<p>No existen dietas asociadas</p>
							) : /^\d+(DB)$/g.test(recipeDetail.id) ? (
								recipeDetail.diets.map((diet, index) => (
									<span key={index}>{diet.name}</span>
								))
							) : (
								recipeDetail.diets.map((diet, index) => (
									<span key={index}>{diet}</span>
								))
							)}
						</div>
					</section>

					<section>
						<p>Steps:</p>
						<div
							dangerouslySetInnerHTML={{
								__html: recipeDetail.instructions,
							}}></div>
					</section>
				</section>
				<Link className={`${recipeDetailclass.backHome}`} to={'/'}>
					BACK TO HOME
				</Link>
			</div>
		</>
	);
};

export default RecipeDetail;
