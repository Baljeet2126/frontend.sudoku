import { createReducer, on } from "@ngrx/store"
import { getGameBoard, updateGameBoard } from "./sudoku.actions"
import { GameState } from "../../model/sudokuState";
export const initialState = 0
export  const Board_initial_state: GameState = { board : []};
export const SudokuReducer = createReducer(Board_initial_state,
  on(getGameBoard, (state) => ({ ...state })),
  on(updateGameBoard, (state, { board }) => ({ ...state, board: board })))




        
    
    
    