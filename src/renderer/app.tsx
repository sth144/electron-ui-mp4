import React, { useEffect } from 'react';
import Mp4Clipper from "./mp4-clipper/mp4-clipper.component"

export default function App(): JSX.Element {
  useEffect(() => {
    window.ipcAPI?.rendererReady();
  }, []);

  const handleFileClipped = (clippedFile: File) => {
    // Do something with the clipped file
    console.log('Clipped file:', clippedFile);
  };
  return (
    <div className="app">
      <Mp4Clipper onFileClipped={handleFileClipped} />
    </div>
  );
}
