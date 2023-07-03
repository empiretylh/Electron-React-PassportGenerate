import imgt from '../../../assets/image/h3.png';
import html2canvas from 'html2canvas';
import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { CheckCircle } from 'react-bootstrap-icons';
import './paper.css';
interface PaperProps {
  paperSize: string;
  dpi: number;
  margin: number;
  imagesize: string;
  imageCount: number;
  images: never[];
  ilandscape: boolean;
  plandscape: boolean;
  selectedImages: never[];
  setSelectedImages: any;
  ref: any;
  filter: never[];
}

function swapValue(value1: any, value2: any): any[] {
  let value3: any = value1;
  value1 = value2;
  value2 = value3;

  return [value1, value2];
}

function DecideLandscape(
  paperWidth: any,
  paperHeight: any,
  imageHeight: any,
  imageWidth: any
): boolean {
  const portraitImagesInWidth = Math.floor(paperWidth / imageHeight);
  const portraitImagesInHeight = Math.floor(paperHeight / imageWidth);
  const portraitImagesTotal = portraitImagesInWidth * portraitImagesInHeight;

  const landscapeImagesInWidth = Math.floor(paperWidth / imageWidth);
  const landscapeImagesInHeight = Math.floor(paperHeight / imageHeight);
  const landscapeImagesTotal = landscapeImagesInWidth * landscapeImagesInHeight;

  console.log(portraitImagesTotal, landscapeImagesTotal);

  if (portraitImagesTotal > landscapeImagesTotal) {
    return false;
  }
  return true;
}

const Paper = forwardRef((props, ref) => {
  let {
    paperSize,
    dpi,
    margin = 20,
    imagesize,
    images,
    ilandscape = false,
    plandscape = true,
    selectedImages,
    setSelectedImages,
    filter,
  }: PaperProps = props;

  let [pw, ph]: string[] = paperSize.split(',');

  let [ImageWidth, ImageHeight]: string[] = imagesize.split(',');

  const ImageRef = useRef(0);

  console.log(ImageWidth, ImageHeight);

  useImperativeHandle(ref, () => ({
    exportImage: exportImage,
  }));

  const exportImage = () => {};

  margin = (dpi / 300) * parseFloat(margin);

  let imageWidth: number = parseFloat(ImageWidth) * dpi;
  let imageHeight: number = parseFloat(ImageHeight) * dpi;

  let paperWidth = (dpi / 300) * parseFloat(pw);
  let paperHeight = (dpi / 300) * parseFloat(ph);
  console.log(imageWidth, imageHeight, paperWidth, paperHeight);

  if (DecideLandscape(paperWidth, paperHeight, imageWidth, imageHeight)) {
    [imageWidth, imageHeight] = swapValue(imageWidth, imageHeight);
  }

  const [img_data, setImgData] = useState([]);

  useEffect(() => {
    const getImage = async (imguri: string) => {
      const result = await window.electron.ipcRenderer.invoke('uritoimg', [
        imguri,
      ]);
      console.log(result);
      if (result) {
        setImgData((prev) => [...prev, result[0]]);
      }
    };

    console.log(images.length, 'Image Length');
    setImgData([]);
    images.map((img, index) => {
      console.log('Getting image', img);
      getImage(img);
    });
  }, [images,filter]);

  console.log("Filter,,,,,,,",filter)

  // Generate dynamic image elements
  const imageElements = useMemo(() => {
    console.log(img_data.length,images.length)
    if (img_data.length == images.length) {
      return img_data.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Image ${index + 1}`}
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            margin: margin,
            filter: filter[index]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
          }}
          className={
            selectedImages.includes(index) ? 'beautyIMG selected' : 'beautyIMG'
          }
          onClick={() => {
            console.log(selectedImages)
            setSelectedImages([index]);
          }}
        />
      ));
    }
  }, [img_data, images,selectedImages]);

  return (
    <div
      ref={ImageRef}
      style={{
        width: `${paperWidth}px`,
        height: `${paperHeight}px`,
        maxWidth: `${paperWidth}px`,
        maxHeight: `${paperHeight}px`,
        minWidth: `${paperWidth}px`,
        minHeight: `${paperHeight}px`,
        backgroundColor: 'white',
        transform: plandscape ? 'rotate(-90deg)' : 'rotate(0deg)',
        transformOrigin: '50% 50%',
        padding: 0,
        margin: 100,
      }}
    >
      {img_data.length > 0 ? imageElements : null}
    </div>
  );
});

export default Paper;
