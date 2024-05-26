require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const Menu = require("./models/menu");

const connectDB = require("./controllers/connect");
const route = require("./routes/route");



const PORT = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/order", async (req, res) => {
  const menuItems = await Menu.find();
  res.render("order",{menuItems:menuItems});
});

app.use("/api/", route);

const start = async () => {
  try {
    await connectDB(process.env.mongodb_uri);
    app.listen(PORT, () => {
      console.log(`${PORT} Is Connected`);
    });
  } catch (err) {
    console.log(err);
  }
};

app.get('/menuItems/:type', async (req, res) => {
  try {
    const type = req.params.type;
      const response = await fetch('http://localhost:5000/api/menu/getMenuFromType/'+type);
      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      res.render('demo', { menuItems: data.menuItemsBySubtype });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});


start();
