export type Sudoku = Array<Array<SudokuField>>;

export interface SudokuField {
  value?: number;
  readonly?: boolean;
  rowIndex? :number;
  colIndex? : number;
}



