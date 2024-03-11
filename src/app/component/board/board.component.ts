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

  onFieldClick(field: SudokuField,rowIndex:number, colIndex:number): void {
    this.activeField = {};
    this.activeField = field;
    this.activeField.rowIndex = rowIndex;
    this.activeField.colIndex = colIndex;
    this.activeField.readonly = field.readonly;
    this.activeField.value = !this.activeField.readonly && this.activeField.value! >0 ? undefined : this.activeField.value
    this.activeFieldChange.emit(this.activeField);
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


