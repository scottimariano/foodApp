/* eslint-disable import/no-extraneous-dependencies */
const { expect, chai } = require('chai');
const app = require('../../src/app.js');
const { Recipe } = require('../../src/db.js');
const request = require('supertest');
const recipe = {
	title: 'Milanesa a la napolitana',
	summary: 'test',
};

describe('Recipes Routes', () => {
	before(async () => {
		await Recipe.sync({ force: true });
	});

	describe('POST /recipes', () => {
		it('should return status 404 and corresponding text if any of the mandatory parameters is not send', async () => {
			const res = await request(app).post('/recipes');
			expect(res.statusCode).to.equal(404);
			expect(res.text).to.equal(
				'Creating new recipe requires title and summary'
			);
		});
		it('should return status 201 and a message: `Recipe was succesfully created`', async () => {
			const res = await request(app).post('/recipes').send(recipe);
			expect(res.statusCode).to.equal(201);
			expect(res.text).to.equal('Recipe was succesfully created');
		});
	});
});

describe('Asociations Routes', () => {
	const recipe2 = {
		title: 'Milanesa a la napolitana',
		summary: 'test',
		diets: ['vegan', 'dairy free'],
	};
	before(async () => {
		await Recipe.sync({ force: true });
		const res = await request(app).get('/asoc');
	});

	it('should create a recipe with the corresponding diets', async () => {
		const res2 = await request(app).post('/recipes').send(recipe2);
		const recipeNew = await request(app).get('/recipes/1DB');
		expect(recipeNew.body.diets).to.have.deep.members([
			{ name: 'vegan' },
			{ name: 'dairy free' },
		]);
	});
});
