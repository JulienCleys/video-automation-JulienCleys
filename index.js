const {
  render
} = require("@nexrender/core");
const fetch = require("node-fetch");

let aepxfile = "musicVisualiser_JulienCleys.aep";
const aerender = "C:/Program Files/Adobe/Adobe After Effects 2022/Support Files/aerender.exe";

let muziek = "audio.mp3";
let background = "background.jpg";
let image = "image.jpg";
let fps = 25;

let song = "";
let artist = "";
let duration = fps * 5;
let project = {};

let date = "";
let filename = "";

async function getArtistAndTitle() {
  await fetch("http://localhost:3500/")
    .then(res => res.json())
    .then((data) => {
      artist = data[data.length - 1].artist;
      song = data[data.length - 1].titel;
      let min = data[data.length - 1].minuut;
      let sec = data[data.length - 1].seconde;
      duration = fps * ((60 * min) + sec);

      date = new Date();
      filename = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()} _${song}-${artist}`;
    });
}

getArtistAndTitle().then(() => {
  project = {
    template: {
      src: `file:///D:/nexrender/assets/${aepxfile}`,
      composition: "musicVisualiser",
      frameStart: 0,
      frameEnd: duration,
    },
    assets: [{
        type: "image",
        name: `${background}`,
        layerName: `${background}`,
        src: `file:///D:/nexrender/assets/nexrenderAssets/${background}`,
      },
      {
        type: "image",
        name: `${image}`,
        layerName: `${image}`,
        src: `file:///D:/nexrender/assets/nexrenderAssets/${image}`,
      },
      {
        type: "audio",
        name: `${muziek}`,
        layerName: `${muziek}`,
        src: `file:///D:/nexrender/assets/nexrenderAssets/${muziek}`,
      },
      {
        type: "data",
        layerName: "song",
        property: "Source Text",
        value: `${song}`,
      }, {
        type: "data",
        layerName: "music artist",
        property: "Source Text",
        value: `${artist}`,
      },
    ],
    actions: {
      postrender: [{
          module: "@nexrender/action-encode",
          output: "output.mp4",
          preset: "mp4",
          params: {
            "-acodec": "aac",
            "-vcodec": "libx264",
            "-r": `${fps}`
          }
        },
        {
          module: "@nexrender/action-copy",
          input: "output.mp4",
          output: `D:/nexrender/results/${filename}.mp4`,
        },
      ],
    }
  };

  // console.log(project);
  const main = async () => {
    const result = await render(project, {
      logger: console,
      workpath: "D:/nexrender/temp",
      binary: aerender,
      debug: true,
      skipCleanup: false,
    });
    console.log("rendering finished");
  };
  main().catch(console.error);
});