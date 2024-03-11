import { Sudoku } from "../model/sudoku";

export const Utility = {
  encodeBoard(board:any){ 
    return board.reduce((result:any, row:any, i:any) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length -1 ? '' : '%2C'}`, '')
  },
  
  encodeParams(params: any) {
    return Object.keys(params)
      .map(key => key + '=' + `%5B${this.encodeBoard(params[key])}%5D`)
      .join('&');
  },

  map_board_respone(request: number[][])
  {
      return request.map(row => row.map(number =>({ value: number ==0 ? undefined : number, readonly :number !==0 })));
  },

  map_board_request(response: Sudoku)
  {
    let val = response.map(row => row.map(col =>
      { return col.value == undefined ? 0 : col.value;
      
      }
    ));
    return val;
  },
  NumberButton : [
    { number: 1 },
    { number: 2 },
    { number: 3 },
    { number: 4 },
    { number: 5 },
    { number: 6 },
    { number: 7 },
    { number: 8 },
    { number: 9 }
  ]
};