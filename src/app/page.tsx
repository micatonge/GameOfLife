import Game from './components/Game';
import './globals.css'; 
import { ChakraProvider, Text } from '@chakra-ui/react'; 

function App() {
  return (
    <ChakraProvider>
      <div className="app2">
        {/* Title */}
        <Text className="title" fontSize="50px" fontWeight="bold" color="white" textShadow="2px 2px 4px rgba(255, 252, 252, 0.466)">
          Conway's <br/> Game of Life
        </Text>
        
        {/* Subtitle */}
        <Text className="title" fontSize="15px" fontWeight="400" paddingTop="150px" color="white">
          Next.JS | Typescript | Chakra UI 
        </Text>
        
        {/* Introduction */}
        <Text className="title" fontSize="15px" paddingTop="190px" fontWeight="200" color="white" maxWidth="500px">
          Welcome to Conway's Game of Life, a captivating journey into the realm of cellular automata. Created by the mathematician John Conway in 1970, this game unfolds on an infinite two-dimensional grid, where each square cell can either be alive or dead. 
        </Text>
        
        {/* Rules */}
        <Text className="title" fontSize="15px" paddingTop="300px" fontWeight="200" color="white" maxWidth="500px">
          <b>Underpopulation:</b> Any live cell with fewer than two live neighbors dies, as if by loneliness. <br/>
          <b>Survival:</b> A live cell with two or three live neighbors continues to thrive in the next generation. <br/>
          <b>Overpopulation:</b> A live cell with more than three live neighbors dies, overwhelmed by the bustling community. <br/>
          <b>Reproduction:</b> A dead cell with exactly three live neighbors springs to life, as if by magic.
        </Text> 
        
        {/* Game Component */}
        <Game />
      </div>
    </ChakraProvider>
  );
}

export default App;
