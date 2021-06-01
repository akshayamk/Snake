import { useEffect, useRef } from 'react';

export const keyDirection = {
  UP: 'UP',
  RIGHT: 'RIGHT',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
};

export const BOARD_SIZE = 15;
export const INITIAL_SNAKE_DIRECTION = keyDirection.RIGHT;
export const INITIAL_SNAKE_FOOD_ROW = 5;
export const INITIAL_SNAKE_FOOD_COL = 12;
export const SNAKE_SPEED = 200;
export const INITIAL_SNAKE_SIZE = 1;
export const INITIAL_SCORE = 0;
export const INITIAL_START_ROW = Math.round(BOARD_SIZE / 3);;
export const INITIAL_START_COL = Math.round(BOARD_SIZE / 3);

// Copied from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
export function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Copied from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

