import { BoardTypeSelector } from 'web-app/client/src/paragraph/boards/select-board-type.js';
import { ajaxProvider } from 'web-app/client/src/paragraph/providers.js';
import { assert } from 'chai';

describe('board type selector', function() {
	let boardTypeSelector;
	let mockBoards;

	beforeEach(() => {
		mockBoards = {
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

	it('should render content type options successfully', done => {

		const expectedOptions = ['Bar Chart', 'Mark Down', 'Sequence Diagram', 'Math', 'Venn Diagram'];

		assert.equal(boardTypeSelector.isShown(), false);
		boardTypeSelector.render().then(() => {
			// assert
			assert.equal(boardTypeSelector.isShown(), true);
			const optionNodes = mockBoards.addBoardHeader.querySelectorAll("div ul li");
			const options = Array.prototype.slice.call(optionNodes).map(node=>node.textContent);
			assert.deepEqual(options, expectedOptions);
			done();
		});
	});
});
