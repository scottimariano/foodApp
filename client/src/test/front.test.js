import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import isReact from 'is-react';

import * as data from '../../db.json';
import * as actions from '../Redux/actions/index.actions';

import CreateRecipe from '../Components/CreateRecipe/CreateRecipe';

configure({ adapter: new Adapter() });

describe('<CreateRecipe/>', () => {
	const state = { diets: data.diets, dishTypes: data.dishTypes };
	const mockStore = configureStore([thunk]);
	const { createRecipeAction } = actions.createRecipe; // VER QUE TRAER

	beforeAll(() => expect(isReact.classComponent(CreateRecipe)).toBeFalsy());

	describe('Formulario de creación de recetas', () => {
		let createRecipe;
		let store = mockStore(state);
		beforeEach(() => {
			createRecipe = mount(
				<Provider store={store}>
					<MemoryRouter initialEntries={['/createRecipe']}>
						<CreateRecipe />
					</MemoryRouter>
				</Provider>
			);
		});

		it('Debe renderizar un formulario', () => {
			expect(createRecipe.find('form').length).toBe(1);
		});

		it('Debe renderizar un input con la propiedad "title" igual a "title', () => {
			expect(createRecipe.find('input[name="title"]').length).toBe(1);
		});

		it('Debe renderizar un input de tipo number con la propiedad "name" igual a "healthScore"', () => {
			expect(createRecipe.find('input[name="healthScore"]').length).toBe(1);
			expect(createRecipe.find('input[type="number"]').length).toBe(2);
		});
		it('Debe renderizar un textarea con la propiedad name igual a "summary"', () => {
			expect(createRecipe.find('textarea[name="summary"]').length).toBe(1);
		});
	});

	describe('Evitar actualizar la pagina al enviar el formulario', () => {
		let createRecipe, useState, useStateSpy;
		let store = mockStore(state);

		beforeEach(() => {
			useState = jest.fn();
			useStateSpy = jest.spyOn(React, 'useState');
			useStateSpy.mockImplementation((initialState) => [
				initialState,
				useState,
			]);
			store = mockStore(state, createRecipeAction);
			store.clearActions();
			createRecipe = mount(
				<Provider store={store}>
					<MemoryRouter initialEntries={['/createRecipe']}>
						<CreateRecipe />
					</MemoryRouter>
				</Provider>
			);
		});

		afterEach(() => jest.restoreAllMocks());

		it('Debe evitar que se refresque la página luego de hacer submit con el uso del evento "preventDefault"', () => {
			const event = { preventDefault: () => {} };
			jest.spyOn(event, 'preventDefault');
			createRecipe.find('form').simulate('submit', event);
			expect(event.preventDefault).toBeCalled();
		});
	});
});
