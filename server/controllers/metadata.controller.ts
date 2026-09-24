import { parseFile } from "music-metadata";
import { inspect } from "node:util";

(async () => {
  try {
    const filePath =
      "/home/adityak/Projects/youphoria/server/Media/My Beautiful Dark Twisted Fantasy [E]/01. Dark Fantasy (Album Version (Explicit)).flac";
    const metadata = await parseFile(filePath);

    // Output the parsed metadata to the console in a readable format
    console.log(inspect(metadata, { showHidden: false, depth: null }));
  } catch (error: any) {
    console.error("Error parsing metadata:", error.message);
  }
})();
