import { createAction, props } from "@ngrx/store";
import { Sudoku, SudokuField } from '../model/sudoku';
export const increment = createAction('[Sudoku Component] Increment')
export const decrement = createAction('[Sudoku Component] decrement')
export const reset = createAction('[Sudoku Component] reset')
export const selectCell = createAction(
    '[Sudoku] Select Cell',
    props<{ value?: number; readonly?: boolean; rowIndex?:number,colIndex? : number }>()
  );
export const getGameBoard = createAction('[Sudoku Component]  get current game board',)
export const updateGameBoard = createAction('[Sudoku Component] update game board',  props<{ board: number[][] }>());
export const removeGameBoard =  createAction('[Sudoku Component] remove game board')
export const original_gameBoard = createAction('[Sudoku Component] original game board')
export const initializeGameBoard = createAction(
    '[Sudoku Component] Initialize',
    props<{ board: Sudoku }>()
  );