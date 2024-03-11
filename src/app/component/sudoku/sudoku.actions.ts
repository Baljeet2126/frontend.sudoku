import { createAction, props } from "@ngrx/store";
import { Sudoku } from '../../model/sudoku';
export const getGameBoard = createAction('[Sudoku Component]  get current game board',)
export const updateGameBoard = createAction('[Sudoku Component] update game board',  props<{ board: number[][] }>());
export const initializeGameBoard = createAction(
    '[Sudoku Component] Initialize',
    props<{ board: Sudoku }>()
  );