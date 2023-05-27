import React, { ChangeEventHandler, Component } from 'react';
import { injectable, inject } from "inversify"

import Button from '@material-ui/core/Button';
import { Box, TextField } from '@material-ui/core';
import { Mp4ClipperProps, Mp4ClipperState, Mp4ClipperService } from "./mp4-clipper.service"
import DragAndDrop from './drag-and-drop.component'


// TODO: output directory input

// @injectable()
export default class Mp4Clipper extends Component<Mp4ClipperProps, Mp4ClipperState> {
  private mp4ClipperService: Mp4ClipperService;
  // private videoRef = React.createRef<Video>();

  constructor(props: Mp4ClipperProps) {
    super(props);
    // TODO: get DI working?
    this.mp4ClipperService = new Mp4ClipperService(); //container.get(Mp4ClipperService);
    this.mp4ClipperService.clipMp4(null as unknown as File, 1, 3)
    this.state = {
      file: null,
      startClipTime: null,
      endClipTime: null,
      outputPath: "~/tmp/"
    };
  }

  private handleFileSelectEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.handleFileSelect(event.target.files as FileList);
  };

  private handleClipClick = async () => {
    const { file, startClipTime, endClipTime } = this.state;
    if (file && startClipTime !== null && endClipTime !== null) {
      const clippedFile = await this.mp4ClipperService.clipMp4(file, startClipTime, endClipTime);
      this.props.onFileClipped(clippedFile);
    }
  };

  private captureFrame(whichFrame: "begin" | "end") {
    var canvas: HTMLCanvasElement = document.getElementById(`canvas-${whichFrame}`) as HTMLCanvasElement;
    var video: HTMLVideoElement = document.querySelector("video") as HTMLVideoElement;
    canvas.width = video.videoWidth / 4;
    canvas.height = video.videoHeight / 4;
    ((canvas as HTMLCanvasElement)
      .getContext("2d") as CanvasRenderingContext2D)
      .drawImage(video, 0, 0, canvas.width, canvas.height);

    if (whichFrame === "begin") {
      this.setState({
        startClipTime: video.currentTime
      });
    } else if (whichFrame === "end") {
      this.setState({
        endClipTime: video.currentTime
      });
    }
    /** End **/
  }

  public handleFileSelect = (files: FileList) => {
    const file = files[0];
    if (file) {
      this.setState({ file });
    }
  }

  public onOutputDirectoryChange = (event: Event) => {
    this.setState({
      outputPath: (event.target as unknown as { value: string })?.value
    })
  }

  render() {
    const { file, startClipTime, endClipTime, outputPath } = this.state;

    // TODO: format buttons, drag video option

    return (

      <Box style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>

          {file === null ? '' :
            <div >
              <video id="video" width="750" height="500" controls >
                <source src={(file === null) ? '' : file.path} type="video/mp4" />
              </video>
            </div>}
          <div >
            {this.state.startClipTime}
            <canvas id="canvas-begin"></canvas>
          </div>
          <div >
            {this.state.endClipTime}
            <canvas id="canvas-end"></canvas>
          </div>
        </div>
        <div style={{ display: "flex", height: "30%", alignItems: "space-evenly", justifyContent: "space-evenly" }}>

          {file === null ? "" : (
            <div>
              <Button variant="contained" color="primary" onClick={() => this.captureFrame("begin")} component="label">Capture Begin</Button>
            </div>)}
          {file === null ? "" : (
            <div>
              <Button variant="contained" color="primary" onClick={() => this.captureFrame("end")} component="label">Capture End</Button>
            </div>)}
          {file === null ? "" : (
            <div>
              <Button variant="contained" color="primary" onClick={this.handleClipClick}>
                Clip MP4 File
              </Button>
            </div>)}
          <Button variant="contained" component="label">
            Select MP4 File
            <input
              type="file"
              hidden
              onChange={this.handleFileSelectEvent}
              accept=".mp4"
            />
          </Button>
          or
          <DragAndDrop handleDrop={this.handleFileSelect}>
            <a>Drop Here</a>
            <div>{this.state.file?.name}</div>
          </DragAndDrop>
        </div>
        {file === null ? "" : (
          <div style={{ display: "flex", height: "30%", alignItems: "space-evenly", justifyContent: "space-evenly" }}>
            <div>
              <TextField label="Output Directory" variant="outlined" value={outputPath}
                onChange={this.onOutputDirectoryChange as unknown as ChangeEventHandler<HTMLInputElement>} />
            </div>
          </div>
        )}
      </Box>
    );
  }
}