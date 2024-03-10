import { createReducer, on } from "@ngrx/store"
import { decrement, increment, reset,getGameBoard, updateGameBoard } from "../state/sudoku.actions"
import { GameState } from "../model/sudokuState";
import { Sudoku } from "../model/sudoku";
import { state } from "@angular/animations";

export const initialState = 0
export  const gameBoard_initial_state: GameState = { board : []};
export  const Board_initial_state: Sudoku = [];
export const CounterReducer = createReducer(initialState,
    on( increment,(state : number)=> state + 1),
    on(decrement,(state: number)=> state - 1),
    on(reset,(state: number)=> 0)
);
export const SudokuReducer = createReducer(gameBoard_initial_state,
  on(getGameBoard, (state) => ({ ...state })),
  on(updateGameBoard, (state, { board }) => ({ ...state, board: board })))




        
    
    
    