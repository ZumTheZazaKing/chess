import { useState, useContext, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Context } from "../context/Context";
const Chess = require("chess.js");

export const chess = new Chess('8/8/8/8/8/8/8/8 w - - 0 1');

export const ChessboardContainer = () => {

    let {turn, setTurn} = useContext(Context);
    
    const [fen, setFen] = useState(chess.fen());
    const [chessboardwidth, setChessboardwidth] = useState(400);
    const [enemyType, setEnemyType] = useState(null);
    const [message, setMessage] = useState("");
    const [inCheck, setInCheck] = useState(false);

    useEffect(() => {
        setInterval(() => {
            window.innerWidth >= 400 ? setChessboardwidth(400) : setChessboardwidth(300);
        },100);
    })

    const newGame = () => {
        chess.load('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        setFen(chess.fen())
        setMessage("White's Turn")
    }

    const checkInCheck = () => {if(chess.in_check()){setInCheck(true)}else{setInCheck(false)}}

    const checkInCheckmate = () => {
        if(chess.in_checkmate()){
            setInCheck(false);
            turn === "w" ? setMessage("White Wins") : setMessage("Black Wins");
        }
    }

    const checkInStalemate = () => {
        if(chess.in_stalemate()){
            setInCheck(false);
            setMessage("Stalemate")
        }
    }

    const checkDraw = () => {
        if(chess.in_draw()){
            setInCheck(false);
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
            }
        }
    }

    return (
        <div id="Chessboard">
            <button onClick={() => {vsComputer()}}>VS Computer</button>
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
            <h3 id="message">{message} {inCheck ? "(In Check)" : ""}</h3>
        </div>
    )
}