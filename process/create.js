import Connect from "./connect";
import { initDB } from "./db";
export default function() {
  initDB();
  Connect();
}
