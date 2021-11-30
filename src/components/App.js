import { lazy, Suspense, useState } from 'react';
import { Context } from '../context/Context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chessboard = lazy(() => import('./Chessboard').then(module => ({default:module.ChessboardContainer})));

function App() {

  const [turn, setTurn] = useState("w");

  return (
    <div className="App">
      <Suspense fallback={<div id="loading"><h1>Loading...</h1></div>}>
        <Context.Provider value={{
            turn,setTurn
          }}>

            <Chessboard/>

        </Context.Provider>
      </Suspense>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
