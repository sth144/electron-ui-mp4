
import { Container } from "inversify";
import { Mp4ClipperInterface, Mp4ClipperService } from "./mp4-clipper/mp4-clipper.service"

const container = new Container();// Add our services to the container
container.bind<Mp4ClipperInterface>('Mp4ClipperService').to(Mp4ClipperService);

export default container;