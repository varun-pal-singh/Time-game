import React, { useContext } from "react";
import GameBoard from "../GameBoard/GameBoard";
import Navbar from "../Navbar/Navbar";
import ScoreBoard from "../ScoreBoard/ScoreBoard";
import StartButton from "../StartButton/StartButton";
import ModalMessage from "../ModalMessage/ModalMessage";
import InstructionsModal from "../ModalMessage/Instructions";
import DataContext from "../../GameContext";

const GameUI = ({ isReady, setIsReady }) => {
  const { mainValToFind, gameStarted } = useContext(DataContext);

  return (
    <>
      <Navbar />
      <ScoreBoard />
      {gameStarted && <h2>Find all the cards with the number: {mainValToFind}</h2>}
      <GameBoard />
      <StartButton />
      <ModalMessage isReady={isReady} setIsReady={setIsReady} />
      <InstructionsModal />
    </>
  );
};

export default GameUI;