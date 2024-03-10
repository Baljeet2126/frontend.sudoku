export type  Board = Array<Array<number>>;
export type Difficulty = "easy" | "medium" | "hard";
export type Status = "solved" | "broken" | "unsolved"
 
export type BoardResponse = {
    board : Board;
}

export type SudokuRequest = {
    board : Board;
}


export type SudokuResponse ={
difficulty : Difficulty;
solution : Board;
status : Status 
}

export type ValidateResponse ={
    status : Status
}