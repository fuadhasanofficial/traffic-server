const exprees = require("express");
const app = exprees();
const cors = require("cors");
const port = process.env.PORT || 5000;

const data = require("./data/data.json");
app.use(cors());
app.use(exprees.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://dbuser1:dDhPdfmiVlIvva7s@cluster0.65qq53i.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("traffic-project");
    const car = database.collection("car-information");
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = car.find(query);
      const information = await cursor.toArray();
      res.send(information);
      console.log("data load from database");
    });
    app.get("/search/car/:id", async (req, res) => {
      const id = req.params.id;
      const query = { carNumber: id };
      const cursor = await car.findOne(query);

      res.send(cursor);
      console.log(cursor);
    });

    app.put("/report/car/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { carNumber: id };
      const reportData = req.body;
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          statusCode: reportData.statusCode,
        },
      };
      const result = await car.updateOne(filter, updateDoc, option);

      res.send(result);
      console.log(reportData);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running 5");
});
