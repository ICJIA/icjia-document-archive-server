"use strict";
const fs = require("fs");
const path = require("path");

function getStats(file) {
  const { size, atime, mtime, ctime, birthtime } = fs.statSync(file);
  let obj = {};
  obj.size = size;
  obj.atime = atime;
  obj.mtime = mtime;
  obj.ctime = ctime;
  obj.birthtime = birthtime;
  return obj;
}

function walkDir(directoryRoot, exclusions, archiveBase, mode) {
  const result = [];
  const files = [directoryRoot];
  do {
    const filepath = files.pop();

    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory() && !filepath.includes('/files/test')) {
      fs.readdirSync(filepath).forEach(f => {
        files.push(path.join(filepath, f));
      });
    } else if (
      stat.isFile() &&
      !exclusions.includes(path.relative(directoryRoot, filepath))
    ) {
      let obj = {};

      obj.url = `${archiveBase}/${path.relative(directoryRoot, filepath)}`;
      if (mode === "sitemap") {
        obj.changefreq = "monthly";
        obj.priority = 0.5;
      }
      if (mode === "search") {
        obj.path = "/" + path.relative(directoryRoot, filepath);
        let parts = path.relative(directoryRoot, filepath).split("/");
        obj.agency = parts[0];
        obj.name = path.basename(directoryRoot + "/" + obj.path);
        obj.parent = obj.url.replace(obj.name, "");
        obj.stats = getStats(directoryRoot + "/" + obj.path);
      }

      result.push(obj);
    }
  } while (files.length !== 0);

  return result;
}

function indexArchive({ directoryRoot, archiveBase, exclusions, mode }) {
  return new Promise(function (resolve, reject) {
    let indexArchive = walkDir(directoryRoot, exclusions, archiveBase, mode);
    resolve(indexArchive);
  });
}

module.exports = indexArchive;
