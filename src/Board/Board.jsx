import { BOARD_SIZE ,
    INITIAL_START_ROW,
    INITIAL_START_COL,
    INITIAL_SNAKE_FOOD_ROW,
    INITIAL_SNAKE_FOOD_COL,
    INITIAL_SCORE,
    INITIAL_SNAKE_SIZE, 
    INITIAL_SNAKE_DIRECTION,
    randomIntFromInterval, 
    SNAKE_SPEED,
    useInterval,
    keyDirection } from '../utils/definitions.js';
import './Board.css';
import React, {useEffect, useState} from 'react';



const snakeCoords = {
    row: INITIAL_START_ROW,
    col: INITIAL_START_COL,
};

const snakeFoodCoords = {
    row: INITIAL_SNAKE_FOOD_ROW,
    col: INITIAL_SNAKE_FOOD_COL,
}


const getCellCounter = (row, col) => {

    return (row * BOARD_SIZE) + (col + 1);

}

const snakeArray = new Array(1).fill(0);
snakeArray[0] = getCellCounter(INITIAL_START_ROW, INITIAL_START_COL);



const Board = () => {

    const [score, setScore] = useState(INITIAL_SCORE);
    const [board, setBoard ] = useState(createBoard(BOARD_SIZE));
    const [snake, setSnake ] = useState(snakeArray);
    const [snakesize, setSnakeSize ] = useState(INITIAL_SNAKE_SIZE);
    const [food, setFood ] = useState(getCellCounter(snakeFoodCoords.row, snakeFoodCoords.col));
    const [snakeDirection, setSnakeDirection ] = useState(INITIAL_SNAKE_DIRECTION);
    const [ startGame, setStartGame ] = useState(true);
    //const [ gameOver, setGameOver ] = useState(false);

    


    const displayCells = (rowIdx, cellIdx) => {

        const cellCounter = getCellCounter(rowIdx, cellIdx);

        let className = "cell"
        if (snake.includes(cellCounter)){
            className += " snake";
        } 

        if (cellCounter === food){
            className += " food";
        }

        return className;

    };



    const incrementScore = () => {
        setScore(score + 1);
    }

    const incrementSnakeSize = () => {
        setSnakeSize(snakesize + 1);
    }

    const getSnakeFood = () => {

        const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
        let nextFoodCell;

        while (true) {
          nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
          if (snake.includes(nextFoodCell) || food === nextFoodCell)
            continue;
          break;
        }

        //set snakeFoodCoords
        snakeFoodCoords.row = Math.floor(nextFoodCell/BOARD_SIZE);
        snakeFoodCoords.col = nextFoodCell % BOARD_SIZE;

        setFood(getCellCounter(snakeFoodCoords.row, snakeFoodCoords.col));

    }

    const growSnake = () => {

        let newCellToAdd = getCellCounter(snakeFoodCoords.row, snakeFoodCoords.col);

        let tempSnake = [];
        for (let i = 0; i <snakesize; i++){
            tempSnake.push(snake[i]);
        }

        tempSnake.push(newCellToAdd);
        
        setSnake(tempSnake);
        incrementSnakeSize();

    }

    const markDeath = () => {
        const displayString = 'You scored ' + score + ' points.';
        window.alert("GAME OVER! " + displayString);
        setStartGame(false);
    };

    const getDirection = (key) => {
        if (key.code === 'ArrowUp') return keyDirection.UP;
        if (key.code === 'ArrowRight') return keyDirection.RIGHT;
        if (key.code === 'ArrowDown') return keyDirection.DOWN;
        if (key.code === 'ArrowLeft') return keyDirection.LEFT;

        return '';
    };
   
    const checkBoundaries = () => {

        if (( snakeCoords.row < 0) || (snakeCoords.col < 0)){
            return false;
        }
        if (( snakeCoords.row === BOARD_SIZE ) || (snakeCoords.col === BOARD_SIZE)){
            return false;
        }

        let snakeHeadCellNumber = getCellCounter(snakeCoords.row, snakeCoords.col);
        for (let i = 1; i < snakesize; i++){
            if (snake[i] === snakeHeadCellNumber){
                return false;
            }   
        }

        return true;

    };


    const checkKeyPress= (key) => {

        let directionKey = getDirection(key);

        if (directionKey !== ''){
            setSnakeDirection(directionKey);

        }

    };


    const updateSnake = () => {

        let tempSnake = [];

        switch(snakeDirection){
            case keyDirection.UP:
                tempSnake.push(snake[0] - BOARD_SIZE);
                break;

            case keyDirection.DOWN:
                tempSnake.push(snake[0] + BOARD_SIZE);
                break;
            
            case keyDirection.RIGHT:
                tempSnake.push(snake[0] + 1);
                break;

            case keyDirection.LEFT:
                tempSnake.push(snake[0] - 1);
                break;
            
            default: //since initial direction is set to RIGHT
                tempSnake.push(snake[0] + 1)

        }

        for (let i = 0; i < snakesize-1; i++){
            tempSnake.push(snake[i]);
        
        }
        setSnake(tempSnake);
         
    };

    const moveSnake = () => {


        if ((snakeCoords.col === snakeFoodCoords.col) && (snakeCoords.row === snakeFoodCoords.row)){
            growSnake();
            //updateSnake();
            incrementScore();
            getSnakeFood();
        }

        else{

            if (snakeDirection === keyDirection.UP){
                snakeCoords.row -= 1;
            }
    
            if (snakeDirection === keyDirection.DOWN){
                snakeCoords.row += 1;
            }
    
            if (snakeDirection === keyDirection.LEFT){
                snakeCoords.col -= 1;
            }
    
            if (snakeDirection === keyDirection.RIGHT){
                snakeCoords.col += 1;
            }

            updateSnake();

        }
        

        if (!checkBoundaries()){
            markDeath();
        }

    };

    const InitialiseSnake = () => {
        snakeFoodCoords.row = INITIAL_SNAKE_FOOD_ROW;
        snakeFoodCoords.col = INITIAL_SNAKE_FOOD_COL;
        setSnake(snakeArray);
        snakeCoords.row = INITIAL_START_ROW;
        snakeCoords.col = INITIAL_START_COL;
        setFood(getCellCounter(snakeFoodCoords.row, snakeFoodCoords.col));
        setSnakeSize(INITIAL_SNAKE_SIZE);
        setSnakeDirection(INITIAL_SNAKE_DIRECTION);
        setScore(INITIAL_SCORE);
        setStartGame(true);
    }

    const restartGame = () =>{
        InitialiseSnake();
    }
    
    //upon first render of page
    useEffect(() => {
        window.addEventListener('keydown', (e) =>{
            checkKeyPress(e);
        })
    },[]);

    useInterval(() => {
        if (startGame){
            moveSnake();
        }
        else{
            restartGame();
        }
    }, SNAKE_SPEED);



    return (
        <>
        <h1>Score: {score}</h1>
        <h1>Snake Size: {snakesize}</h1>

        <div className="board">
          {board.map((row, rowIdx) => (
            <div key={rowIdx} className="row">{
                row.map((cell, cellIdx) =>( 
                     <div key={ cellIdx} className = {displayCells(rowIdx, cellIdx)}></div>
                ))
            }</div>
          ))}
        </div>
        </>
    );
};

const createBoard = (row) => {

    const board = [];
    let counter = 1;

    for (let i = 0; i < row; i++){
        const currentRow = [];
        for (let j = 0; j < row; j++){
            currentRow.push(counter);
            counter += 1;
        }
        board.push(currentRow);
    }

    //console.log(board);
    return board;

};
  


export default Board;

