import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PassportMaker from './screens/PassportMaker';
import BeautyMaker from './screens/BeautyMaker';
import Home from './screens/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageResult from './screens/imgresult';
import BImageResult from './screens/BeautyImgResult';
import PrintPaper from './screens/printpaper';
import { useMemo, useState, useEffect } from 'react';
import { ImageData, PaperData, PaperSize } from './context/context';
import RegisterPage from './screens/Register';
import imgt from '../../assets/image/h3.png';
import InvitationMaker from './screens/Invitationmaker';
import Setting from './screens/setting';
import ImageEditor from './screens/ImageEditor';

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
                <Route path="/" element={<ImageEditor />} />
              ) : (
                <Route path="/" element={<RegisterPage />} />
              )}
              {/* <Route path="/" element={<ImageResult />} /> */}
              <Route path="/passportmaker" element={<PassportMaker />} />
              <Route
                path="/passportmaker/imgresult/:imgcount"
                element={<ImageResult />}
              />
              <Route path="/beautymaker" element={<BeautyMaker />} />
              <Route
                path="/beautymaker/imgresult/:imgcount/:paperSize/:imagesize"
                element={<BImageResult />}
              />
              <Route path="/invitationmaker" element={<InvitationMaker />} />
              <Route path="/paper" element={<PrintPaper />} />
              <Route path="/settings" element={<Setting />} />
            </Routes>
          </Router>
        </PaperSize.Provider>
      </PaperData.Provider>
    </ImageData.Provider>
  );
}

// const App = () => {
//   // Dynamic variables
//   const paperSize = 'A4'; // A4, A5, 4x6, etc.
//   const imageCount = 4;

//   // Calculate paper dimensions in pixels based on the paper size
//   const getPaperDimensions = (size) => {
//     switch (size) {
//       case 'A4':
//         return { width: 2480 / 6, height: 3508 / 6 }; // A4 size in pixels (at 300 DPI)
//       case 'A5':
//         return { width: 1748 / 6, height: 2480 / 6 }; // A5 size in pixels (at 300 DPI)
//       case '4x6':
//         return { width: 1200 / 6, height: 1800 / 6 }; // 4x6 size in pixels (at 300 DPI)
//       // Add more cases for other paper sizes as needed
//       default:
//         return { width: 0, height: 0 }; // Default to 0 if invalid size provided
//     }
//   };

//   const { width: paperWidth, height: paperHeight } =
//     getPaperDimensions(paperSize);

//   // Calculate image width and height based on paper dimensions and image count
//   const imageWidth = 4 * 50;
//   const imageHeight = 5.7 * 50; // Maintain aspect ratio based on the given 3.9 x 5.7 size

//   // Generate dynamic image elements
//   const imageElements = [];
//   for (let i = 0; i < imageCount; i++) {
//     imageElements.push(
//       <img
//         key={i}
//         src={imgt}
//         alt={`Image ${i + 1}`}
//         style={{ width: `${imageWidth}px`, height: `${imageHeight}px`,margin:3 }}
//       />
//     );
//   }

//   return (
//     <div
//      className='paper'
//       style={{
//         width: `${paperWidth}px`,
//         height: `${paperHeight}px`,
//         maxWidth: `${paperWidth}px`,
//         maxHeight: `${paperHeight}px`,
//         minWidth: `${paperWidth}px`,
//         minHeight: `${paperHeight}px`,
//         backgroundColor: 'burlywood',
//         padding: 0,
//       }}
//     >
//       {imageElements}
//     </div>
//   );
// };

// export default App;
