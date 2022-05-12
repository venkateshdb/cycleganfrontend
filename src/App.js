import './App.css';
import Header from './components/header';
import Tiles from './components/tiles';
import Fotter from './fotter/Fotter';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import DragandDrop from './components/dragdrop';
function App() {
  return (
    <>
    <Header/>
    <Tiles/>
      <div className='container'>
        <DragandDrop/>
      </div>
    {/* <Fotter/> */}
    </>
  );
}

export default App;
