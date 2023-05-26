import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import icon from '../../assets/icon.svg';
=======
>>>>>>> 2a065f488538723148ea359cfde63625c03aab06
import './App.css';
import Home from './screens/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageResult from './screens/imgresult';
import PrintPaper from './screens/printpaper';
<<<<<<< HEAD
import { useMemo, useState } from 'react';
import { ImageData, PaperData, PaperSize } from './context/context';
import RegisterPage from './screens/Register';
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
=======
import { useMemo, useState, useEffect } from 'react';
import { ImageData, PaperData, PaperSize } from './context/context';
import RegisterPage from './screens/Register';
>>>>>>> 2a065f488538723148ea359cfde63625c03aab06

export default function App() {
  const [imgsSelect, setImgsSelect] = useState([]);

  const [paperList, setPaperList] = useState([]);

<<<<<<< HEAD
=======
  const [isAvaliable, setIsAvaliable] = useState(false);

>>>>>>> 2a065f488538723148ea359cfde63625c03aab06
  const [papersize, setPSize] = useState('2480,3508');

  const SelectValue = useMemo(
    () => ({ imgsSelect, setImgsSelect }),
    [imgsSelect, setImgsSelect]
  );

  const PaperValue = useMemo(
    () => ({ paperList, setPaperList }),
    [paperList, setPaperList]
  );

  const sizeValue = useMemo(
    () => ({ papersize, setPSize }),
    [papersize, setPSize]
  );

<<<<<<< HEAD
=======
  const getData = async () => {
    const result = await window.electron.ipcRenderer.invoke('last_avaliable');
    setIsAvaliable(result);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('key_listen', (data) => {
      setIsAvaliable(data.avaliable);
    });

    return () => {
      window.electron.ipcRenderer.removeListener('key_listen');
    };
  }, []);

>>>>>>> 2a065f488538723148ea359cfde63625c03aab06
  return (
    <ImageData.Provider value={SelectValue}>
      <PaperData.Provider value={PaperValue}>
        <PaperSize.Provider value={sizeValue}>
          <Router>
            <Routes>
<<<<<<< HEAD
              <Route path="/" element={<RegisterPage />} />
              <Route path="/" element={<Home />} />
=======
              {isAvaliable ? (
                <Route path="/" element={<Home />} />
              ) : (
                <Route path="/" element={<RegisterPage />} />
              )}
>>>>>>> 2a065f488538723148ea359cfde63625c03aab06
              {/* <Route path="/" element={<ImageResult />} /> */}
              <Route path="imgresult/:imgcount" element={<ImageResult />} />
              <Route path="/paper" element={<PrintPaper />} />
            </Routes>
          </Router>
        </PaperSize.Provider>
      </PaperData.Provider>
    </ImageData.Provider>
  );
}
