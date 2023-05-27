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

  return (
    <ImageData.Provider value={SelectValue}>
      <PaperData.Provider value={PaperValue}>
        <PaperSize.Provider value={sizeValue}>
          <Router>
            <Routes>
              {isAvaliable ? (
                <Route path="/" element={<Home />} />
              ) : (
                <Route path="/" element={<RegisterPage />} />
              )}
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
