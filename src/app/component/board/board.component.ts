import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Sudoku, SudokuField } from '../../model/sudoku';
import { NumberButton } from '../../model/numberButton';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports:[CommonModule]
})
export class BoardComponent {
  @Input() gameBoard: Sudoku = [];
  @Input() activeField?: SudokuField;
  @Output() activeFieldChange = new EventEmitter<SudokuField>();

  sudoku: Sudoku  = [];
  currentField: any;
 
  constructor() {
     
  }


  ngOnInit() {
   // this.gameBoard = this.gameBoard.map(row => row.map(number =>({ value: number.value ==0 ? undefined : number.value, readonly : number.readonly })));
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gameBoard']) {
      this.activeField = undefined;
  

    }
  }



  onFieldClick(field: SudokuField,rowIndex:number, colIndex:number): void {
    this.activeField = {};
    this.activeField = field;
    this.activeField.rowIndex = rowIndex;
    this.activeField.colIndex = colIndex;
    this.activeField.readonly = field.readonly;
    this.activeFieldChange.emit(this.activeField);
  }

  
  insertNumber(number: number) {
    const field = this.currentField;
     if (!field.readonly) {
      field.value = number;
    }
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

  
}


