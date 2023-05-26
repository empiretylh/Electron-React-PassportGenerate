import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './screens/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageResult from './screens/imgresult';
import PrintPaper from './screens/printpaper';
import { useMemo, useState, useEffect } from 'react';
import { ImageData, PaperData, PaperSize } from './context/context';
import RegisterPage from './screens/Register';

export default function App() {
  const [imgsSelect, setImgsSelect] = useState([]);

  const [paperList, setPaperList] = useState([]);

  const [isAvaliable, setIsAvaliable] = useState(false);

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
