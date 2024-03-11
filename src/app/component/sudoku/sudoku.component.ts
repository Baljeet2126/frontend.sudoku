// Import Angular core and related modules
import { Component, HostListener, inject } from '@angular/core';
import { Sudoku, SudokuField } from '../../model/sudoku';
import { NumberButton } from '../../model/numberButton';
import { BoardComponent } from '../board/board.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { BoardService } from '../../service/board.service';
import { HttpClientModule } from '@angular/common/http';
import { Difficulty, Status, SudokuRequest } from '../../model/board';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import * as SudokuActions from './sudoku.actions';
import { Utility } from '../../utility/utility';

// Function to limit a value to a specified range
const board_range = (newValue: number, min: number, max: number) => {
  return Math.min(Math.max(newValue, min), max);
};

@Component({
  selector: 'app-sudoku',
  standalone: true,
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss'],
  // Importing necessary Angular modules and Material components
  imports: [
    BoardComponent, CommonModule,
    MatButtonModule, MatIconModule,
    MatToolbarModule,
    MatSelectModule, HttpClientModule,
    FormsModule, StoreModule,
    MatCardModule, MatProgressSpinnerModule,
  ]
})
export class SudokuComponent {
  private store = inject(Store);
  gameBoard: Sudoku = [];
  activeField?: SudokuField;
  localBoard: number[][] = [];
  difficulty_level: Difficulty = "easy";
  status: Status = "unsolved";
  board$?: Observable<number[][]> | undefined;
  numberButtons: NumberButton[] = Utility.NumberButton
  game_status: string | undefined;
  loading: boolean = false;

  constructor(private apiService: BoardService) {
    this.board$ = this.store.select('Sudoku_reducer');
  }

  ngOnInit() {
    this.prepareBoard();
  }

  // Function to prepare Game Board based on selected difficulty level and it fetech value via API.
  private prepareBoard() {
    this.loading = true;
    this.apiService.getBoard(this.difficulty_level).subscribe({
      next: (data) => {
        this.localBoard = data.board.map((row) => [...row]);
        this.store.dispatch(SudokuActions.updateGameBoard({ board: this.localBoard }));
        this.gameBoard = Utility.map_board_respone(this.localBoard);
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      },
    });
  }

  // Function to handle changing difficulty level
  change_DifficultyLevel(level: Difficulty) {
    this.game_status = "";
    this.difficulty_level = level; 
    this.prepareBoard();
  }

  // Function to validate the current game board
  validateBoard() {
    this.game_status = "";
    let request = this.get_sudokuRequest();
    this.apiService.validateBoard(Utility.encodeParams(request)).subscribe({
      next: (data) => {
        this.game_status = `Game is ${data.status}.`;
        this.status = data.status;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  // Function to start a new game
  newGame() {
    this.game_status = "";
    this.prepareBoard();
  }

  // Function to construct a SudokuRequest object from the current game board
  get_sudokuRequest() {
    let board = Utility.map_board_request(this.gameBoard);
    let request: SudokuRequest = { board: board };
    return request;
  }

  // Function to solve the current puzzle
  solvePuzzle() {
    this.game_status = "";
    let request = this.get_sudokuRequest();
    this.apiService.solveBoard(request).subscribe({
      next: (data) => {
        this.localBoard = data.solution;
        this.store.dispatch(SudokuActions.updateGameBoard({ board: this.localBoard }));
        this.gameBoard = Utility.map_board_respone(data.solution);
        this.game_status = `Game is  ${data.status}.`;
        this.status = "solved";
      },
      error: (e) => console.error(e)
    });
  }

  // Keyboard event listeners for arrow keys, backspace, and number keys
  @HostListener('window:keydown.arrowUp') onArrowUp(): void {
    this.moveFocus(0, -1);
  }

  @HostListener('window:keydown.arrowDown') onArrowDown(): void {
    this.moveFocus(0, 1);
  }

  @HostListener('window:keydown.arrowLeft') onArrowLeft(): void {
    this.moveFocus(-1, 0);
  }

  @HostListener('window:keydown.arrowRight') onArrowRight(): void {
    this.moveFocus(1, 0);
  }

  @HostListener('window:keydown.backspace') onBackspace(): void {
    this.erase();
  }
  @HostListener('window:keydown.escape') onEscape(): void {
    this.erase();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const number = parseInt(event.key, 10);
    if (!this.activeField || isNaN(number) || number < 1 || number > 9) {
      return;
    }
    this.insertNumber(number);
  }

  // Function to erase the value of the active cell
  erase() {
    if (this.activeField && !this.activeField.readonly) {
      this.activeField.value = undefined;
    }
  }

  // Function to insert a number into the active cell
  insertNumber(number: number) {
    if (this.activeField && !this.activeField.readonly) {
      let i = this.activeField.rowIndex!;
      let j = this.activeField.colIndex!;
      this.activeField.value = number;
      // Check if the cell is readonly before updating
      if (!this.gameBoard[i][j].readonly) {
        this.gameBoard[i][j] = this.activeField;
        this.localBoard = Utility.map_board_request(this.gameBoard);
      }
      else {
        console.log(`Cell at position (${i}, ${j}) is readonly and cannot be updated.`);
      }
    }
    this.store.dispatch(SudokuActions.updateGameBoard({ board: this.localBoard }));
  }

  // Getter for the current row index of the active cell
  get currentRow(): number {
    return this.gameBoard.findIndex(row => row.indexOf(this.activeField!) !== -1);
  }

  // Getter for the current column index of the active cell
  get currentCol(): number {
    if (!this.activeField || this.currentRow === -1) {
      return -1;
    }

    return this.gameBoard[this.currentRow].indexOf(this.activeField);
  }

  // Function to move the focus to a new cell based on arrow key input
  private moveFocus(relativeCol = 0, relativeRow = 0): void {
    if (!this.activeField) {
      return;
    }
    const newRow = board_range(this.currentRow + relativeRow, 0, 8);
    const newCol = board_range(this.currentCol + relativeCol, 0, 8);
    this.activeField = this.gameBoard[newRow][newCol];
  }
}
