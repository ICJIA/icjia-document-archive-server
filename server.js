require("dotenv").config();
const port = process.env.PORT || 3000;
const serverToken = process.env.VUE_APP_ARCHIVE_SECRET;
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");
const cors = require("cors");
const fs = require("fs-extra");
const temp_directory = "./.tmp/";
const indexArchive = require("./lib/indexArchive");
const buildDirectoryTree = require("./lib/buildDirectoryTree");
const { createSitemap } = require("sitemap");

if (!fs.existsSync(temp_directory)) {
    console.log("create temp directory");
    fs.mkdirSync(temp_directory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb, dest) => {
        cb(null, temp_directory);
    },
    filename: (req, file, cb) => {
        const newFilename = `${file.originalname}`;

        cb(null, newFilename);
    }
});

const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/utils/check", (req, res) => res.send({ status: 200, msg: "Working!" }));

app.get("/check", (req, res) => res.send({ status: 200, msg: "Working!" }));

app.get("/sitemap.xml", async function (req, res) {
    let sitemapObj = {
        directoryRoot: path.resolve(__dirname + "/root/files"),
        archiveBase: "https://archive.icjia.cloud/files",
        exclusions: [],
        mode: "sitemap"
    };
    let urls = await indexArchive(sitemapObj);
    const sitemap = createSitemap({
        cacheTime: 600000, // 600 sec - cache purge period
        urls
    });
    try {
        const xml = sitemap.toXML();
        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.get("/searchIndex.json", async function (req, res) {
    try {
        let searchObj = {
            directoryRoot: path.resolve(__dirname + "/root/files"),
            mode: "search",
            archiveBase: "https://archive.icjia.cloud/files",
            exclusions: []
        };
        let searchIndex = await indexArchive(searchObj);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(searchIndex));
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.get("/directoryTree.json", async function (req, res) {
    try {
        let directoryObj = {
            directoryRoot: "root"
        };
        let directoryTree = await buildDirectoryTree(directoryObj);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(directoryTree));
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

app.post("/uploadFiles", upload.array("files"), async (req, res) => {
    let clientToken = req.body.uploadToken;
    if (clientToken !== serverToken) {
        res.status(403).end();
    } else {
        let dir = req.body.path;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        let successfulUploads = [];
        let failedUploads = [];

        req.files.forEach(file => {
            if (!fs.existsSync(dir + file.originalname)) {
                successfulUploads.push(file.originalname);
                fs.moveSync(
                    temp_directory + file.originalname,
                    dir + file.originalname,
                    function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    }
                );
            } else {
                failedUploads.push(file.originalname);
                fs.emptyDirSync(temp_directory);
                console.log("File exists: ", dir + file.originalname);
            }
        });

        res.send({
            status: 200,
            msg: "Success",
            allFiles: req.files,
            successfulUploads,
            failedUploads
        });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
