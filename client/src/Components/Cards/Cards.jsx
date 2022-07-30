import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RecipeCard from './RecipeCard/RecipeCard';
import cards from './cards.module.css';

const Cards = (props) => {
	let recipes = useSelector((state) => state.recipesToShow);
	const [pageArray, setpageArray] = useState([]);
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);
	const [toogleNext, settoogleNext] = useState(false);
	const [tooglePrev, settooglePrev] = useState(true);

	useEffect(() => {
		setPage(() => 1);
		setPages(() => Math.ceil(recipes.length / 9));
		setpageArray(() => recipes.slice(9 * (page - 1), 9 + 9 * (page - 1)));
	}, []);

	useEffect(() => {
		setPage(() => 1);
		setPages(() => Math.ceil(recipes.length / 9));
	}, [recipes]);

	useEffect(() => {
		setpageArray(() => recipes.slice(9 * (page - 1), 9 + 9 * (page - 1)));
	}, [recipes, page]);

	useEffect(() => {
		if (page === pages || !pageArray.length) {
			settoogleNext(true);
		} else {
			settoogleNext(false);
		}
		if (page === 1) {
			settooglePrev(true);
		} else {
			settooglePrev(false);
		}
	}, [page, pages]);

	function pageForward() {
		setPage((page) => page + 1);
	}
	function pageBackwards() {
		setPage((page) => page - 1);
	}

	return (
		<>
			<section className={`${cards.cardsCanvas}`}>
				{pageArray.length ? (
					pageArray.map((r, index) => (
						<RecipeCard
							key={index}
							id={r.id}
							title={r.title}
							image={r.image}
							diets={r.diets}
							readyInMinutes={r.readyInMinutes}
							healthScore={r.healthScore}
						/>
					))
				) : (
					<p>No hay recetas para mostrar</p>
				)}
			</section>
			{pages > 1 ? (
				<div className={`${cards.pages}`}>
					<button
						id="btnPrevPage"
						disabled={tooglePrev}
						className={`${cards.inButton}`}
						onClick={() => pageBackwards()}>
						PREV
					</button>
					<span>{page}</span>
					<button
						id="btnNextPage"
						className={`${cards.inButton}`}
						disabled={toogleNext}
						onClick={() => pageForward()}>
						NEXT
					</button>
				</div>
			) : null}
		</>
	);
};

export default Cards;
