const fs = require("fs");
const http = require("http");
const Canvas = require("canvas");
const express = require("express");
const app = express();
const port = 8888;
const fetch = require("node-fetch");

global.Headers = fetch.Headers;
console.log(global.Headers);
// gloal

let h = new global.Headers();
h.append("Access-Control-Allow-Origin", "*");

function loadJson(filename) {
  let raw_data = fs.readFileSync(filename, "utf8");
  let json = JSON.parse(raw_data);
  return json;
}

function loadData(filename) {
  let json = loadJson(filename);
  let data = json[0].keypoints;

  for (let i = 0; i < 5; i++) {
    data.shift();
  }
  data2 = {};
  data.forEach((d) => {
    data2[d.part] = d.position;
  });
  return data2;
}

function loadSetOData(filename) {
  let json = loadJson(filename);
  let data2 = [];
  json.forEach((d) => {
    data = d.keypoints;
    for (let i = 0; i < 5; i++) {
      data.shift();
    }
    data3 = {};
    data.forEach((d) => {
      data3[d.part] = d.position;
    });
    data2.push(data3);
  });
  return data2;
}

const images = {
  easy: {
    count: 6,
    data: [],
  },
  medium: {
    count: 8,
    data: [],
  },
  hard: {
    count: 5,
    data: [],
  },
};

function loadImage() {
  for (let difficulty in images) {
    for (let i = 0; i < images[difficulty].count; i++) {
      data = fs.readFileSync(
        "assets/images/" +
          difficulty +
          "/" +
          difficulty +
          "_" +
          (i + 1) +
          ".jpg"
      );
      let img = new Canvas.Image();
      img.src = data;

      let canvas = Canvas.createCanvas(img.width, img.height);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      images[difficulty].data.push(canvas.toDataURL());
    }
  }
}

let goal, connected_part;

app.use(express.static("public"));
app.use("/js", express.static(__dirname + "public/js"));

app.set("views", "./views");
app.set("view engine", "ejs");

let diff = ["easy", "medium", "hard"];
goal = {};
diff.forEach(
  (d) => (goal[d] = loadSetOData("assets/data/data_" + d + ".json"))
);
loadImage();
loadConnectedPart();

//Địa chỉ truy cập trang chủ
app.get("/trangchu", (req, res) => {
  res.render("TPH_index");
});

//Địa chỉ truy cập về chúng tôi
app.get("/vechungtoi", (req, res) => {
  res.render("TPH_aboutus");
});

//Địa chỉ truy cập khởi động
app.get("/khoidong", (req, res) => {
  res.render("TPH_warmup");
});

//Phần tập luyện chính
app.get("/main", (req, res) => {
  res.render("TPH_mainApp");
});

let server = app.listen(port, () => console.info(`Truy cập tại cổng ${port}`));
const io = require("socket.io")(server);

function loadConnectedPart() {
  connected_part = loadJson("assets/data/connected_part.json");
}

io.on("connection", (socket) => {
  console.log("Một người dùng đã truy cập vào tập luyện!");
  loadConnectedPart();
  socket.difficulty = "easy";
  socket.emit(
    "localData",
    goal[socket.difficulty],
    connected_part,
    images[socket.difficulty].data
  );
});
