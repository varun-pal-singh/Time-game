import { Box, Button, Grow } from "@mui/material";
import { useContext } from "react";
import DataContext from "../../GameContext";

function GameBoard() {
  const { buttonStates, gameMap, RevealHiddenColors, gameLevel, disableGameButtons } = useContext(DataContext);
  
  const gridSize = gameLevel + 3;

  return (
    <Box container sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2
    }}>
      <Box 
        container 
        sx={{ 
          display: "grid", 
          gap: "10px", 
          p: "5px",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          maxWidth: '80vw',
          margin: '0 auto'
        }}
      >
        {
          gameMap.current.map((val, index) =>
            <Grow in={true} key={index} style={{ transformOrigin: '0 0 0' }}
              {...({ timeout: 1000 })}>
              <Button
                onClick={() => { RevealHiddenColors(index) }} 
                disabled={disableGameButtons.current || buttonStates.current[index]} 
                key={index} 
                sx={{ 
                  backgroundColor: buttonStates.current[index] ? 'white' : 'rgb(23, 105, 170)',
                  color: 'black',
                  // Increased font size
                  fontSize: '2.2rem',
                  borderRadius: "10px", 
                  border: "thin solid",
                  // Increased minimum dimensions
                  minWidth: '70px',
                  minHeight: '70px',
                  width: '100%',
                  height: '100%',
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {buttonStates.current[index] ? val : ''}
              </Button>
            </Grow>
          )
        }
      </Box>
    </Box>
  );
}

export default GameBoard;