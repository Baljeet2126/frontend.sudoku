import { Component, HostListener,  inject } from '@angular/core';
import { Sudoku, SudokuField } from '../../model/sudoku';
import { NumberButton } from '../../model/numberButton';
import { BoardComponent } from '../board/board.component';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card';
import { Observable,  } from 'rxjs';
import { Store, StoreModule} from '@ngrx/store'
import { BoardService } from '../../service/board.service';
import { HttpClientModule } from '@angular/common/http';
import { Difficulty, Status, SudokuRequest } from '../../model/board';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import * as SudokuActions from '..//../state/sudoku.actions';
import { Utility } from '../../utility/utility';

const board_range = (newValue: number, min: number, max: number) => {
  return Math.min(Math.max(newValue, min), max);
};


@Component({
  selector: 'app-sudoku',
  standalone:true,
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss'],
  imports:[
    BoardComponent,CommonModule,
    MatButtonModule,MatIconModule,
    MatToolbarModule,
    MatSelectModule,HttpClientModule,
    FormsModule,StoreModule,
    MatCardModule,MatProgressSpinnerModule
  ]
})
export class SudokuComponent  {
  private store = inject(Store);
  gameBoard: Sudoku = [];
  activeField?: SudokuField;
  sudokuGrid : number[][] = [];
  localBoard : number[][] = [];
  difficulty_level: Difficulty = "easy"  ;
  status :Status = "unsolved"
  board$? : Observable<number[][]> | undefined;
  numberButtons: NumberButton[] = [
    {number: 1},
    {number: 2},
    {number: 3},
    {number: 4},
    {number: 5},
    {number: 6},
    {number: 7},
    {number: 8},
    {number: 9}
  ];
  game_status: string | undefined ;
  loading:boolean = false;
  constructor(private apiService: BoardService){
   this.board$ = this.store.select('Sudoku_reducer');
  }

  ngOnInit() {
   this.prepareBoard();
  }

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

change_DifficultyLevel(level:Difficulty)
{
    this.game_status = "";
    this.difficulty_level = this.difficulty_level;
    this.prepareBoard()
}

 validateBoard()
{
  this.game_status = ""
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

newGame()
{
  this.game_status = "";
    this.difficulty_level = this.difficulty_level;
    this.prepareBoard()
}

get_sudokuRequest()
{
    let board = Utility.map_board_request(this.gameBoard)
    let request: SudokuRequest = {board : board} 
    return request;
}

solvePuzzle()
{
    this.game_status = "";
    let request = this.get_sudokuRequest();
    this.apiService.solveBoard(request).subscribe({
        next: (data) => {;
         this.localBoard = data.solution;
         this.store.dispatch(SudokuActions.updateGameBoard({ board:  this.localBoard }));
         this.gameBoard =Utility.map_board_respone(data.solution);
         this.game_status = `Game is  ${data.status}.`;
         this.status = "solved";
        },
        error: (e) => console.error(e)
      });
}

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

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const number = parseInt(event.key, 10);
    if (!this.activeField || isNaN(number) || number < 1 || number > 9) {
      return;
    }
    this.insertNumber(number);
  }

  erase() {
    if (this.activeField && !this.activeField.readonly) {
      this.activeField.value = undefined;
    }
  }

  insertNumber(number: number) {
    if (this.activeField && !this.activeField.readonly) {
      let i = this.activeField.rowIndex!;
      let j = this.activeField.colIndex!;
      this.activeField.value = number;
      // Check if the cell is readonly before updating
      if (!this.gameBoard[i][j].readonly ) {
        this.gameBoard[i][j]= this.activeField;
        this.localBoard = Utility.map_board_request(this.gameBoard);
      } 
      else {
        console.log(`Cell at position (${i}, ${j}) is readonly and cannot be updated.`);
      }
    }
    this.store.dispatch(SudokuActions.updateGameBoard({ board:  this.localBoard }));
}

  get currentRow(): number {
    return this.gameBoard.findIndex(row => row.indexOf(this.activeField!) !== -1);
  }

  get currentCol(): number {
    if (!this.activeField || this.currentRow === -1) {
      return -1;
    }

    return this.gameBoard[this.currentRow].indexOf(this.activeField);
  }

  private moveFocus(relativeCol = 0, relativeRow = 0): void {
    if (!this.activeField) {
      return;
    }
    const newRow = board_range(this.currentRow + relativeRow, 0, 8);
    const newCol = board_range(this.currentCol + relativeCol, 0, 8);
    this.activeField = this.gameBoard[newRow][newCol];
  }

}
