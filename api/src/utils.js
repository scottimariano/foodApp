function propsToDiets(recipe) {
	let checkDiet = (diet) => {
		if (!recipe[diet] && !recipe.diets.includes(diet)) {
			recipe.diets.push(diet);
		}
	};
	checkDiet('gluten free');
	checkDiet('vegetarian');
	checkDiet('vegan');
}

function shortenResponse(recipe) {
	return {
		id: recipe.id,
		title: recipe.title,
		image: recipe.image,
		dishTypes: recipe.dishTypes,
		diets: recipe.diets,
		summary: recipe.summary,
		healthScore: recipe.healthScore,
		instructions: recipe.instructions,
		readyInMinutes: recipe.readyInMinutes,
	};
}

module.exports = { shortenResponse, propsToDiets };
