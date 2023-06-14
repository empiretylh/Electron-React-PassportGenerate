import imgt from '../../../assets/image/h3.png';
import html2canvas from 'html2canvas';
import React, { useImperativeHandle, forwardRef, useRef } from 'react';

interface PaperProps {
  paperSize: string;
  dpi: number;
  margin: number;
  imagesize: string;
  imageCount: number;
  images: never[];
  ilandscape: boolean;
  plandscape: boolean;
  ref: any;
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
  }: PaperProps = props;

  let [pw, ph]: string[] = paperSize.split(',');

  let [ImageWidth, ImageHeight]: string[] = imagesize.split(',');

  const ImageRef = useRef(0);

  console.log(ImageWidth, ImageHeight);

  useImperativeHandle(ref, () => ({
    exportImage: exportImage
  }));

  const exportImage = () => {
   
  };

  margin = (dpi / 300) * parseFloat(margin);

  let imageWidth: number = parseFloat(ImageWidth) * dpi;
  let imageHeight: number = parseFloat(ImageHeight) * dpi;

  let paperWidth = (dpi / 300) * parseFloat(pw);
  let paperHeight = (dpi / 300) * parseFloat(ph);
  console.log(imageWidth, imageHeight, paperWidth, paperHeight);

  if (DecideLandscape(paperWidth, paperHeight, imageWidth, imageHeight)) {
    [imageWidth, imageHeight] = swapValue(imageWidth, imageHeight);
  }

  // Generate dynamic image elements
  const imageElements = images.map((img, index) => (
    <img
      key={index}
      src={img}
      alt={`Image ${index + 1}`}
      style={{
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        margin: margin,
      }}
    />
  ));

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
      {imageElements}
    </div>
  );
});

export default Paper;
