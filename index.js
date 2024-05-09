const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: [
        'http://localhost:5174'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const secret_token = process.env.SECRET_ACCESS_TOKEN;

const uri = `mongodb+srv://${user}:${pass}@cluster0.0hiczfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("gadgetsDB");
        const productsCollection = database.collection("products");

        //token request
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, secret_token, { expiresIn: "1h" });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
                })
                .send({success: true})
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Book Hut is running.')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})