// const fs = require("fs");
// const tar = require("tar-stream");
// const zlib = require("zlib");

// var extract = tar.extract();
// var data = "";

// extract.on("entry", (header, stream, cb) => {
//   stream.on("data", (chunk) => {
//     if (header.name == "./OUTPUT.json") {
//       data += chunk;
//     }
//   });
//   stream.on("end", () => {
//     cb();
//   });
//   stream.resume();
// });

// extract.on("finish", () => {
//   fs.writeFile("OUTPUT.json", data, () => {});
// });

// fs.createReadStream("../static/artifact_6a580aed-74e1-4cc7-9533-6d40ef00bbe1.tar.gz")
//   .pipe(zlib.createGunzip())
//   .pipe(extract);

function prURL(user, repo, pullrequestid) {
  return `/2.0/repositories/${user}/${repo}/pullrequests/${pullrequestid}/commits`;
}
