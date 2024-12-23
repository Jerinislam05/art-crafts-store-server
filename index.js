const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yiash.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
		// Connect the client to the server	(optional starting in v4.7)
		// await client.connect();

		const artCraftCollection = client
			.db("artCraftDB")
			.collection("artCraft");

		app.get("/craft", async (req, res) => {
			const cursor = artCraftCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/craft/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await artCraftCollection.findOne(query);
			res.send(result);
		});

		app.get("/categories/:category", async (req, res) => {
			const category = req.params.category;
			const categoryCapitalized =
				String(category).charAt(0).toUpperCase() +
				String(category).slice(1);
			const query = { subcategory_name: categoryCapitalized };
			const result = await artCraftCollection.find(query).toArray();
			res.send(result);
		});

		app.post("/craft", async (req, res) => {
			const newArtCraft = req.body;
			console.log(newArtCraft);
			const result = await artCraftCollection.insertOne(newArtCraft);
			res.send(result);
		});

		app.put("/craft/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updatedCraft = req.body;
			const craft = {
				$set: {
					item_name: updatedCraft.item_name,
					subcategory_name: updatedCraft.subcategory_name,
					image: updatedCraft.image,
					description: updatedCraft.description,
					price: updatedCraft.price,
					rating: updatedCraft.rating,
					customization: updatedCraft.customization,
					processing_time: updatedCraft.processing_time,
					stock_status: updatedCraft.stock_status,
					user_name: updatedCraft.user_name,
					user_email: updatedCraft.user_email,
				},
			};

			try {
				const result = await artCraftCollection.updateOne(
					filter,
					craft,
					options
				);

				// Check if the update was successful and respond with the correct status code and data
				if (result.modifiedCount > 0) {
					res.status(200).json({
						message: "Art & Craft updated successfully",
						modifiedCount: result.modifiedCount,
					});
				} else {
					res.status(400).json({
						message: "No changes made or invalid ID",
					});
				}
			} catch (error) {
				console.error("Error updating craft:", error);
				res.status(500).json({
					message: "Error updating craft. Please try again.",
				});
			}
		});

		app.delete("/craft/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await artCraftCollection.deleteOne(query);
			res.send(result);
		});

		app.put("/myartcraftlist", async (req, res) => {
			const itemName = req.params.user_email;
			const filter = { item_name: new ObjectEmail(itemName) };
			const options = { upsert: true };
			const updatedCraft = req.body;
			const craft = {
				$set: {
					item_name: updatedCraft.item_name,
					subcategory_name: updatedCraft.subcategory_name,
					image: updatedCraft.image,
					description: updatedCraft.description,
					price: updatedCraft.price,
					rating: updatedCraft.rating,
					customization: updatedCraft.customization,
					processing_time: updatedCraft.processing_time,
					stock_status: updatedCraft.stock_status,
					user_name: updatedCraft.user_name,
					user_email: updatedCraft.user_email,
				},
			};
			const result = await artCraftCollection.updateOne(
				filter,
				craft,
				options
			);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		// await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Crafts shop server is running");
});

app.listen(port, () => {
	console.log(`Crafts shop server is running on ${port}`);
});
