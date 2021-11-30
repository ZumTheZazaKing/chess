import { useState, useContext, useEffect } from "react";
import Chessboard from "chessboardjsx";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Context } from "../context/Context";
import { toast } from 'react-toastify';
const Chess = require("chess.js");

export const chess = new Chess('8/8/8/8/8/8/8/8 w - - 0 1');

export const ChessboardContainer = () => {

    let {turn, setTurn} = useContext(Context);
    
    const [fen, setFen] = useState(chess.fen());
    const [chessboardwidth, setChessboardwidth] = useState(400);
    const [enemyType, setEnemyType] = useState(null);
    const [message, setMessage] = useState("");
    const [inCheck, setInCheck] = useState(false);
    const [gameStart, setGameStart] = useState(false);

    useEffect(() => {
        setInterval(() => {
            window.innerWidth >= 400 ? setChessboardwidth(400) : setChessboardwidth(300);
        },100);
    })

    const newGame = () => {
        chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        setFen(chess.fen())
        setMessage("White's Turn")
        setGameStart(true);
        setTurn('w');
    }

    const checkInCheck = () => {if(chess.in_check()){setInCheck(true)}else{setInCheck(false)}}

    const checkInCheckmate = () => {
        if(chess.in_checkmate()){
            setInCheck(false);
            setGameStart(false);
            turn === "w" ? setMessage("White Wins") : setMessage("Black Wins");
        }
    }

    const checkInStalemate = () => {
        if(chess.in_stalemate()){
            setInCheck(false);
            setGameStart(false);
            setMessage("Stalemate")
        }
    }

    const checkDraw = () => {
        if(chess.in_draw()){
            setInCheck(false);
            setGameStart(false);
            setMessage("Draw");
        }
    }

    const checkingPackage = () => {
        checkInCheck();
        checkDraw();
        checkInCheckmate();
        checkInStalemate();
    }

    const vsComputer = () => {
        newGame();
        setEnemyType("computer");
    }

    const vsHuman = () => {
        newGame();
        setEnemyType("human");
    }

    const handleMove = (move) => {
        if(chess.move(move)){

            setFen(chess.fen());

            if(enemyType === 'computer'){
                setTurn("b");
                setMessage("Black's Turn");
                checkingPackage();

                setTimeout(() => {
                    const moves = chess.moves();

                    if(moves.length > 0){
                        const computerMove = moves[Math.floor(Math.random()*moves.length)];
                        chess.move(computerMove);
                        setFen(chess.fen());
                        setTurn("w");
                        setMessage("White's Turn");
                        checkingPackage();
                    }
                },500);

            } else if(enemyType === "human"){
                if(turn === "w"){
                    setTurn("b");
                    setMessage("Black's Turn");
                    checkingPackage();
                } else if(turn === "b"){
                    setTurn("w");
                    setMessage("White's Turn");
                    checkingPackage();
                }
            }
        } else {
            if(gameStart){return toast.error("Illegal Move")}
            else{return toast.warning("Game Has Ended")}
        }
            
    }

    return (
        <div id="Chessboard">
            <br/>
            <Stack id="options" spacing={2} direction="row">
                <Button variant="contained" onClick={() => {vsComputer()}} disabled={gameStart}>VS Computer</Button>
                <Button variant="contained" color="secondary" onClick={() => {vsHuman()}} disabled={gameStart}>VS Human</Button>
            </Stack>
            <br/>
            <Chessboard
                width={chessboardwidth}
                position={fen}
                onDrop={(move) => 
                handleMove({
                    from:move.sourceSquare,
                    to:move.targetSquare,
                    promotion:'q'
                })}
            />
            <br/>
            <h3 id="message">{message} {inCheck ? "(In Check)" : ""}</h3>
        </div>
    )
}