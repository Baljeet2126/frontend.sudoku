import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import {SudokuReducer } from '../component/sudoku/sudoku.reducers';
export interface State {
}
export const reducers: ActionReducerMap<State> = {
  Sudoku_reducer: SudokuReducer
};
export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
