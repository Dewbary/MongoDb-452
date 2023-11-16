const { MongoClient } = require("mongodb");

const username = encodeURIComponent("bdewberry99");
const password = encodeURIComponent("*Moroni10:5");
const uri = `mongodb+srv://${username}:${password}@brendan-452.fq3b8k0.mongodb.net/`;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("Movies");
    const coll = db.collection("Brendan's Movies");

    // 1
    const cursor1 = coll.find({ title: "Gladiator" });
    await cursor1.forEach(console.log);

    // 2
    const distinctGenres = await coll.distinct("genre");
    distinctGenres.forEach((genre) => console.log(genre));

    // 3
    const cursor3 = coll.find(
      { genre: { $in: ["crime", "drama"] } },
      { projection: { _id: 0, title: 1 } }
    );
    await cursor3.forEach(console.log);

    // 4
    const cursor4 = coll
      .find(
        { "director.last_name": "Hitchcock" },
        { projection: { _id: 0, title: 1, year: 1 } }
      )
      .sort({ year: 1 });
    await cursor4.forEach(console.log);

    // 5
    const cursor5 = coll.find(
      { "actors.last_name": "Cotillard" },
      { projection: { _id: 0, title: 1 } }
    );
    await cursor5.forEach(console.log);

    // 6
    const cursor6 = coll.find(
      { year: { $gte: 1967, $lte: 1995 } },
      { projection: { _id: 0, title: 1, year: 1 } }
    );
    await cursor6.forEach(console.log);

    // 7
    const cursor7 = coll
      .find(
        { year: { $gte: 1967, $lte: 1995 } },
        { projection: { _id: 0, title: 1, year: 1, "director.last_name": 1 } }
      )
      .sort({ year: 1 });
    await cursor7.forEach(console.log);

    // 8
    const cursor8 = coll.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
        },
      },
    ]);
    await cursor8.forEach(console.log);

    // 9
    const cursor9 = coll.aggregate([
      { $unwind: "$actors" },
      {
        $group: {
          _id: {
            country: "$country",
            actor: "$actors",
          },
          numberOfMovies: { $sum: 1 },
        },
      },
      {
        $match: {
          numberOfMovies: { $gt: 2 },
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id.country",
          actor: "$_id.actor",
          numberOfMovies: 1,
        },
      },
    ]);
    await cursor9.forEach(console.log);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
