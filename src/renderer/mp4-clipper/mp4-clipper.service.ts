
import { ipcRenderer } from 'electron';
import { injectable } from 'inversify';


// Define the service that we want to use to clip the file
export interface Mp4ClipperInterface {
  clipMp4(file: File, startClipTime: number, endClipTime: number): Promise<File>;
}

@injectable()
export class Mp4ClipperService implements Mp4ClipperInterface {
  async clipMp4(file: File, startClipTime: number, endClipTime: number): Promise<File> {

    // Send the file and frame indices to the main process via IPC
    ipcRenderer.send('clipMp4', { file: file.path, startClipTime, endClipTime });

    // // Wait for the main process to send back the new file
    return new Promise<File>(resolve => {
      ipcRenderer.once('clippedMp4', (event: any, clippedFile: File) => {
        resolve(clippedFile);
      });
    });
  }
}

// Define the props for our component
export interface Mp4ClipperProps {
  onFileClipped: (clippedFile: File) => void;
}

// Define the state for our component
export interface Mp4ClipperState {
  file: File | null;
  startClipTime: number | null;
  endClipTime: number | null;
  outputPath: string;
}



