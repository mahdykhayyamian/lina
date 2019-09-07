import { BoardTypeSelector } from 'web-app/client/src/paragraph/boards/select-board-type.js';
import { ajaxProvider } from 'web-app/client/src/paragraph/providers.js';
import { assert } from 'chai';

describe('board type selector', function() {
	let boardTypeSelector;

	beforeEach(() => {
		const mockBoards = {
			addBoardHeader: document.createElement('div')
		};
		const addBoardMock = () => {};
		boardTypeSelector = new BoardTypeSelector(mockBoards, addBoardMock);

		const button = document.createElement('button');
		spyOn(document, 'getElementById')
			.withArgs('add-board')
			.and.returnValue(button);

		spyOn(ajaxProvider, 'provide').and.returnValue(() => {
			return {
				get: () =>
					Promise.resolve([
						{
							id: 1,
							type: 'bar-chart',
							name: 'Bar Chart'
						},
						{
							id: 2,
							type: 'markdown',
							name: 'Mark Down'
						},
						{
							id: 3,
							type: 'sequence-diagram',
							name: 'Sequence Diagram'
						},
						{
							id: 4,
							type: 'math',
							name: 'Math'
						},
						{
							id: 5,
							type: 'venn-diagram',
							name: 'Venn Diagram'
						}
					])
			};
		});
	});

	it('should be shown after render', done => {
		assert.equal(boardTypeSelector.isShown(), false);
		boardTypeSelector.render().then(() => {
			// assert
			assert.equal(boardTypeSelector.isShown(), true);
			done();
		});
	});
});
