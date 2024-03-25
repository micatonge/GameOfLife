'use client';
import React, { Component } from 'react';
import { Text, Radio, RadioGroup, Stack } from '@chakra-ui/react'; 
import '../globals.css'; 

// Constants for cell size and board dimensions
const CELL_SIZE = 20;
const WIDTH = 600;
const HEIGHT = 400;

// Props for the individual cell component
interface CellProps {
    x: number;
    y: number;
}

// Interface for defining theme properties
interface Theme {
    name: string;
    aliveColor: string;
    deadColor: string;
}

// Component representing an individual cell on the board
class Cell extends Component<CellProps> {
    render() {
        const { x, y } = this.props;
        return (
            <div className="Cell" style={{
                left: `${CELL_SIZE * x + 1}px`,
                top: `${CELL_SIZE * y + 1}px`,
                width: `${CELL_SIZE - 2}px`, // Subtract 2 to account for border
                height: `${CELL_SIZE - 2}px`, // Subtract 2 to account for border
            }} />
        );
    }
}

// Interface defining the game state
interface GameState {
    cells: { x: number; y: number }[];
    isRunning: boolean;
    interval: number;
    themes: Theme[];
    currentThemeIndex: number;
}

// Main game component
class Game extends Component<{}, GameState> {
    // Reference to the game board
    boardRef: HTMLDivElement | null = null;
    rows: number;
    cols: number;
    board: boolean[][];
    timeoutHandler: number | null = null;

    // Constructor to initialize the game state and board
    constructor(props: {}) {
        super(props);
        this.rows = HEIGHT / CELL_SIZE;
        this.cols = WIDTH / CELL_SIZE;
        this.board = this.makeEmptyBoard();

        // Define color themes
        this.state = {
            cells: [],
            isRunning: false,
            interval: 100,
            themes: [
                { name: 'Default', aliveColor: 'var(--default-alive-color)', deadColor: 'var(--default-dead-color)' },
                { name: 'Dark', aliveColor: 'var(--dark-alive-color)', deadColor: 'var(--dark-dead-color)' },
                { name: 'Light', aliveColor: 'var(--light-alive-color)', deadColor: 'var(--light-dead-color)' }
            ],
            currentThemeIndex: 0 
        };
    }

    // Function to create an empty game board
    makeEmptyBoard(): boolean[][] {
        let board: boolean[][] = [];
        for (let y = 0; y < this.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    // Function to get the offset of an element
    getElementOffset(): { x: number; y: number } {
        if (!this.boardRef) return { x: 0, y: 0 };
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;
        return {
            x: (rect.left + window.pageXOffset) - doc.clientLeft,
            y: (rect.top + window.pageYOffset) - doc.clientTop,
        };
    }

    // Function to create cell objects for rendering
    makeCells(): { x: number; y: number }[] {
        let cells: { x: number; y: number }[] = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    cells.push({ x, y });
                }
            }
        }
        return cells;
    }

    // Event handler for clicking on cells to toggle their state
    handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!this.boardRef) return;
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
        }

        this.setState({ cells: this.makeCells() });
    }

    // Function to start the game
    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    }

    // Function to stop the game
    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    // Function to run a single iteration of the game
    runIteration() {
        let newBoard = this.makeEmptyBoard();

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                    }
                }
            }
        }

        this.board = newBoard;
        this.setState({ cells: this.makeCells() });

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    // Function to calculate the number of live neighbors for a cell
    calculateNeighbors(board: boolean[][], x: number, y: number): number {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }
        return neighbors;
    }
    // Handle change in update interval
    // Parse the input value to an integer and update the state with the new interval
    handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ interval: parseInt(event.target.value) });
    }

    // Handle clearing the board
    // Reset the board to an empty state and update the cells state accordingly 
    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
    }
    // Handle randomly filling the board
    // Iterate over each cell and randomly assign true or false to simulate randomness
    handleRandom = () => {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.board[y][x] = (Math.random() >= 0.5);
            }
        }
        this.setState({ cells: this.makeCells() });
    }

    // Handle change in theme
    // Update the current theme index in the state 
    handleThemeChange = (themeIndex: number) => {
        this.setState({ currentThemeIndex: themeIndex });
    }
    
    render() {
        // Destructure state variables
        const { cells, interval, isRunning, themes, currentThemeIndex } = this.state;
        const { aliveColor, deadColor } = themes[currentThemeIndex];
        return (
            <div className="info">
                <div className="themes">
                    {/* Theme selection */}
                    <Text paddingBottom="10px">Themes</Text>
                    <RadioGroup onChange={(value) => this.handleThemeChange(parseInt(value))} value={currentThemeIndex.toString()}>
                        <Stack>
                            {themes.map((theme, index) => (
                                <Radio key={index} value={index.toString()}>{theme.name}</Radio>
                            ))}
                        </Stack>
                    </RadioGroup>
                </div>
                <div className="app">
                    {/* Game board */}
                    <div className="Board"
                        style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`, backgroundColor: aliveColor }}
                        onClick={this.handleClick}
                        ref={(n) => { this.boardRef = n; }}>
    
                        {/* Render cells */}
                        {cells.map(cell => (
                            <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
                        ))}
                    </div>
                </div>
    
                <div className="controls">
                    {/* Controls */}
                    Update every <input value={interval} onChange={this.handleIntervalChange} /> msec
                    {isRunning ?
                        <button className="button" onClick={this.stopGame}>Stop</button> :
                        <button className="button" onClick={this.runGame}>Run</button>
                    }
                    <button className="button" onClick={this.handleRandom}>Random</button>
                    <button className="button" onClick={this.handleClear}>Clear</button>
                </div>
            </div>
        );
    }
}
export default Game;