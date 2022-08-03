const { Recipe, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Recipe model', () => {
	conn.authenticate().catch((err) => {
		console.error('Unable to connect to the database:', err);
	});
	before(async () => {
		await conn.sync({ force: true });
	});
	describe('Validators', () => {
		it('should not create the Recipe if title is not send', async () => {
			try {
				await Recipe.create({
					summary: 'Test Milanesa summary',
				});
			} catch (error) {
				expect(error.message).to.equal(
					'notNull Violation: recipe.title cannot be null'
				);
			}
		});
		it('should not create the Recipe if summary is not send', async () => {
			try {
				await Recipe.create({
					title: 'Milanesas con fritas',
				});
			} catch (error) {
				expect(error.message).to.equal(
					'notNull Violation: recipe.summary cannot be null'
				);
			}
		});

		it('should create the Recipe if all required properties are ok', async () => {
			const recipe = await Recipe.create({
				title: 'Papas',
				summary: 'test',
			});
			expect(recipe.toJSON()).to.have.property('title', 'Papas');
			expect(recipe.toJSON()).to.have.property('summary', 'test');
			expect(recipe.toJSON()).to.have.property('instructions', null);
		});
	});
});
