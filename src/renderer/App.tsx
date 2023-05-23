import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import Home from './screens/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageResult from './screens/imgresult';
import PrintPaper from './screens/printpaper';
import { useMemo, useState } from 'react';
import { ImageData, PaperData,PaperSize } from './context/context';
function Hello() {
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [imgsSelect, setImgsSelect] = useState([]);

  const [paperList, setPaperList] = useState(['/home/thura/Documents/Pascal/paper/p_0_20230522_232445.jpg']);

  const [papersize,setPSize] = useState('2480,3508');

  const SelectValue = useMemo(
    () => ({ imgsSelect, setImgsSelect }),
    [imgsSelect, setImgsSelect]
  );

  const PaperValue = useMemo(
    () => ({ paperList, setPaperList }),
    [paperList, setPaperList]
  );

  const sizeValue = useMemo(()=>({papersize,setPSize}),[papersize,setPSize])

  return (
    <ImageData.Provider value={SelectValue}>
      <PaperData.Provider value={PaperValue}>
        <PaperSize.Provider value={sizeValue}>
        <Router>
          <Routes>
            
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/" element={<ImageResult />} /> */}
            {/* <Route path="imgresult/:imgcount" element={<ImageResult />} /> */}
            <Route path="/" element={<PrintPaper />}/>
          </Routes>
        </Router>
        </PaperSize.Provider>
      </PaperData.Provider>
    </ImageData.Provider>
  );
}
