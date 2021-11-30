import { lazy, Suspense, useState } from 'react';
import { Context } from '../context/Context';

const Chessboard = lazy(() => import('./Chessboard').then(module => ({default:module.ChessboardContainer})));

function App() {

  const [turn, setTurn] = useState("w");

  return (
    <div className="App">
      <Suspense fallback={<h1>Loading...</h1>}>
        <Context.Provider value={{
            turn,setTurn
          }}>

            <Chessboard/>

        </Context.Provider>
      </Suspense>
    </div>
  );
}

export default App;
