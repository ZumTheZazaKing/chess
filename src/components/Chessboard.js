import { useState, useContext, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { Context } from "../context/Context";
const Chess = require("chess.js");

const chess = new Chess();

export const ChessboardContainer = () => {

    let {setTurn} = useContext(Context);
    
    const [fen, setFen] = useState(chess.fen());
    const [chessboardwidth, setChessboardwidth] = useState(400);

    useEffect(() => {
        setInterval(() => window.innerWidth >= 400 ? setChessboardwidth(400) : setChessboardwidth(300),100);
    })

    const handleMove = (move) => {
        if(chess.move(move)){

            setFen(chess.fen());
            setTurn("b");

            setTimeout(() => {
                const moves = chess.moves();

                if(moves.length > 0){
                    const computerMove = moves[Math.floor(Math.random()*moves.length)];
                    chess.move(computerMove);
                    setFen(chess.fen());
                    setTurn("w");
                }
            },500);
        }
    }

    return (
        <div id="Chessboard">
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
        </div>
    )
}