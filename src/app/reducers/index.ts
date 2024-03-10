import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { CounterReducer, SudokuReducer } from './sudoku.reducers';


export interface State {

}

export const reducers: ActionReducerMap<State> = {
  counter : CounterReducer,
  Sudoku_reducer: SudokuReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
