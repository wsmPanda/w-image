import Stream from "./stream";
import Data from "./data";
import File from "./file";
import video from "./video";
import Batch from "./batch";

export default { ...Data, ...File, ...Stream, ...video, ...Batch };
