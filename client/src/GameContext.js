import { createContext, useState, useRef, useEffect } from "react";

const DataContext = createContext({})

export const DataProvider = ({ children }) => {

  const [gameLevel, SetGameLeveL] = useState(1);
  const [health, setHealth] = useState(3);
  const Achivement = useRef(0);
  const mainValToFind = useRef(null);

  const getGridSize = (level) => level + 3;
  const getTotalCards = (level) => getGridSize(level) * getGridSize(level);

  const ReduceHealth = () => {
    setHealth(health => health - 1);
    if (health === 1) {
      SetMessage(".You have used all your chances");
      setOpen(true);
      ResetGame();
    }
  };

  const [previewSeconds, setSeconds] = useState(5 + (gameLevel * 2));
  const [selectionSeconds, SetSelecionSeconds] = useState(10 + (gameLevel * 3));
  const [gameStarted, SetGameStarted] = useState(false);
  const [gameOver, SetGameOver] = useState(false);
  const [Message, SetMessage] = useState("");

  const interval = useRef(null);
  const selectiontTimeInterval = useRef(null);
  const disableGameButtons = useRef(false);
  const [showInstructions, setShowIstructions] = useState(false);
  const HideInstructions = () => setShowIstructions(false);
  const DisplayInstructions = () => setShowIstructions(true);
  const [resetUpdate, setResetUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [Clicked, SetClicked] = useState(false);
  const [showPreviewCounter, setShowPreviewCounter] = useState(true);

  const StartStage = () => {
    disableGameButtons.current = false;
    const totalCards = getTotalCards(gameLevel);
    buttonStates.current = [...Array(totalCards)].map(() => true);
    setSeconds(5 + (gameLevel * 2));
    setShowPreviewCounter(true);
    SetSelecionSeconds(10 + (gameLevel * 3));
    SetGameStarted(true);
    StartPreviewCounter();
    Achivement.current = gameLevel;
  };

  useEffect(() => {
    if (previewSeconds === 0) stopCounter();
  }, [previewSeconds]);

  useEffect(() => {
    if (selectionSeconds === 0) {
      SetMessage("You ran out of time.");
      setOpen(true);
      stopSelectiontime();
    }
  }, [selectionSeconds]);

  const StartPreviewCounter = () => interval.current = setInterval(() => {
    setSeconds(prevSeconds => prevSeconds - 1);
  }, 1000);

  const StartSelecetionCounter = () => selectiontTimeInterval.current = setInterval(() => {
    SetSelecionSeconds(prevSeconds => prevSeconds - 1);
  }, 1000);

  const stopSelectiontime = () => ResetGame();

  const stopCounter = () => {
    clearInterval(interval.current);
    setSeconds(0);
    const totalCards = getTotalCards(gameLevel);
    buttonStates.current = [...Array(totalCards)].map(() => false);
    SetClicked(prev => !prev);
    setShowPreviewCounter(false);
    StartSelecetionCounter();
  };

  const UpgradeLevel = () => {
    SetGameLeveL(prevLevel => prevLevel + 1);
    clearInterval(selectiontTimeInterval.current);
    SetClicked(prev => !prev);
    SetGameStarted(false);
  };

  const ResetGame = () => {
    setHealth(3);
    SetGameLeveL(1);
    setResetUpdate(prev => !prev);
    clearInterval(selectiontTimeInterval.current);
    SetGameStarted(false);
    SetGameOver(true);
  };

  const CloseModal = () => setOpen(false);
  const correctCards = useRef(0);
  const gameMap = useRef([]);
  const buttonStates = useRef([]);

  const RevealHiddenColors = (Index) => {
    SetClicked(prev => !prev);
    buttonStates.current[Index] = true;
    if (gameMap.current[Index] !== mainValToFind.current) {
      ReduceHealth();
    } else {
      correctCards.current -= 1;
      if (correctCards.current === 0) {
        UpgradeLevel();
      }
    }
  };

  const getRandomIdx = (n) => Math.floor(Math.random() * n);

  useEffect(() => {
    disableGameButtons.current = true;
    const randomVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const n = randomVals.length;
    mainValToFind.current = randomVals[getRandomIdx(n)];

    const totalCards = getTotalCards(gameLevel);
    
    const numMainVals = (4 * gameLevel); 
    
    const newGameMap = [];

    for (let i = 0; i < totalCards - numMainVals; i++) {
      let randomVal;
      do {
        randomVal = randomVals[getRandomIdx(n)];
      } while (randomVal === mainValToFind.current);
      newGameMap.push(randomVal);
    }
    
    for (let i = 0; i < numMainVals; i++) {
        newGameMap.push(mainValToFind.current);
    }

    for (let i = newGameMap.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newGameMap[i], newGameMap[j]] = [newGameMap[j], newGameMap[i]];
    }

    gameMap.current = newGameMap;
    correctCards.current = numMainVals;
    buttonStates.current = [...Array(totalCards)].map(() => false);
    SetClicked(prev => !prev);
  }, [gameLevel, resetUpdate]);

  return (
    <DataContext.Provider value={{ HideInstructions, showInstructions, DisplayInstructions, disableGameButtons, gameOver, Clicked, health, Message, Achivement, open, CloseModal, gameStarted, setHealth, ReduceHealth, gameLevel, UpgradeLevel, ResetGame, previewSeconds, StartStage, buttonStates, RevealHiddenColors, gameMap, showPreviewCounter, selectionSeconds, mainValToFind: mainValToFind.current }}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext;