import React from 'react';
import { Link } from 'react-router-dom';
import recipeCard from './recipeCard.module.css';
import clock from '../../../media/clipart2085481-2.png';
import healthScore from '../../../media/healthScore.png';

const RecipeCard = (props) => {
	return (
		<div className={`${recipeCard.cardCanvas}`}>
			<Link
				style={{ textDecoration: 'none', color: 'black' }}
				to={`recipes/${props.id}`}>
				{props.title.length > 50 ? (
					<h2>{props.title.slice(0, 50)} ...</h2>
				) : (
					<h2>{props.title}</h2>
				)}

				<div className={`${recipeCard.cardContent}`}>
					<img
						className={`${recipeCard.image}`}
						src={props.image}
						alt=""
					/>
					<aside className={`${recipeCard.aside}`}>
						<img className={`${recipeCard.clock}`} src={clock} alt="" />
						<p className={`${recipeCard.clock}`}>
							ready in
							<br />
							{props.readyInMinutes} minutes
						</p>
						<img
							className={`${recipeCard.healthScore}`}
							src={healthScore}
							alt=""
						/>
						<p className={`${recipeCard.healthScore}`}>
							Healt Score:
							<br />
							<b>{props.healthScore}</b>
						</p>
					</aside>
				</div>
				<div className={`${recipeCard.diets}`}>
					{!props.diets ? (
						<p>No existen dietas asociadas</p>
					) : /^\d+(DB)$/g.test(props.id) ? (
						props.diets.map((diet, index) => (
							<div className={`${recipeCard.diet}`} key={index}>
								{diet.name}
							</div>
						))
					) : (
						props.diets.map((diet, index) => (
							<div className={`${recipeCard.diet}`} key={index}>
								<span>{diet}</span>
							</div>
						))
					)}
				</div>
			</Link>
		</div>
	);
};

export default RecipeCard;
