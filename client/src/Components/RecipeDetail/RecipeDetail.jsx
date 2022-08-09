import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	getRecipeDetail,
	clearRecipeDetail,
	deleteRecipe,
} from '../../Redux/actions/index.actions';
import recipeDetailclass from '../RecipeDetail/recipeDetail.module.css';
import clock from '../../media/clipart2085481-2.png';
import healthScore from '../../media/healthScore.png';

const RecipeDetail = (props) => {
	const dispatch = useDispatch();
	const recipeDetail = useSelector((state) => state.recipeDetails);
	const history = useHistory();

	useEffect(() => {
		dispatch(getRecipeDetail(props.match.params.id));
		return () => dispatch(clearRecipeDetail());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleDelete() {
		dispatch(deleteRecipe(recipeDetail.id));
		history.push('/');
	}

	return (
		<div className={`${recipeDetailclass.canvas}`}>
			<section className={`${recipeDetailclass.navBar}`}>
				<Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
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
			{!recipeDetail.title ? (
				<div className={recipeDetailclass.contenedor}>
					<span className={recipeDetailclass.loader}></span>
					<h3 className={recipeDetailclass.loading}>Loading...</h3>
				</div>
			) : (
				<>
					<section className={`${recipeDetailclass.container}`}>
						<section className={`${recipeDetailclass.row1}`}>
							<div className={`${recipeDetailclass.title}`}>
								{recipeDetail.title.length > 80 ? (
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
									<p>There is no dish types associated</p>
								) : /^\d+(DB)$/g.test(recipeDetail.id) ? (
									recipeDetail.dishTypes.map((dishType, index) => (
										<div key={index}>
											<span>{dishType.name}</span>
										</div>
									))
								) : (
									recipeDetail.dishTypes.map((dishType, index) => (
										<div key={index}>
											<span>{dishType}</span>
										</div>
									))
								)}
							</div>
						</section>
						<section className={`${recipeDetailclass.row2}`}>
							<section>
								<div className={`${recipeDetailclass.summary}`}>
									<p>Summary:</p>
									<p
										dangerouslySetInnerHTML={{
											__html: recipeDetail.summary,
										}}></p>
								</div>
								<div className={`${recipeDetailclass.summary}`}>
									<p>Steps:</p>
									<div
										dangerouslySetInnerHTML={{
											__html: recipeDetail.instructions,
										}}></div>
								</div>
							</section>
							<div className={`${recipeDetailclass.foto}`}>
								<img
									src={recipeDetail.image}
									alt={recipeDetail.title}
								/>
								<div className={`${recipeDetailclass.diets}`}>
									{!recipeDetail.diets ? (
										<p>No existen dietas asociadas</p>
									) : /^\d+(DB)$/g.test(recipeDetail.id) ? (
										recipeDetail.diets.map((diet, index) => (
											<div key={index}>
												<span>{diet.name}</span>
											</div>
										))
									) : (
										recipeDetail.diets.map((diet, index) => (
											<div key={index}>
												<span>{diet}</span>
											</div>
										))
									)}
								</div>
							</div>
						</section>
					</section>
					{/^\d+(DB)$/g.test(recipeDetail.id) ? (
						<div
							className={`${recipeDetailclass.deleteButton}`}
							onClick={() => handleDelete()}>
							DELETE
						</div>
					) : null}
					<Link className={`${recipeDetailclass.backHome}`} to={'/'}>
						BACK TO HOME
					</Link>
				</>
			)}
		</div>
	);
};

export default RecipeDetail;
