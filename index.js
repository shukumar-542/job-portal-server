const express = require('express');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.66lxfzt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // Send a ping to confirm a successful connection

        const jobPostCollection = client.db('jobPortal').collection('postJob')
        const AppliedJobCollection = client.db('jobPortal').collection('appliedJobs')

        app.post('/jobPost', async (req, res) => {
            const body = req.body
            const result = await jobPostCollection.insertOne(body);
            res.send(result);
        })

        app.get('/fresher', async(req,res)=>{
            const result = await jobPostCollection.find({experience : '1'}).limit(6).toArray()
            res.send(result);
        })
        app.get('/AllFresherJobs', async(req,res)=>{
            const result = await jobPostCollection.find({experience : '1'}).toArray()
            res.send(result);
        })

        app.get('/experience', async(req,res)=>{
            const result = await jobPostCollection.find({experience : {$gt : '1'}}).limit(6).toArray()
            res.send(result)
        })
        app.get('/allExperienceJobs', async(req,res)=>{
            const result = await jobPostCollection.find({experience : {$gt : '1'}}).toArray()
            res.send(result)
        })
        app.get('/top-company', async(req,res)=>{
            const result = await jobPostCollection.find({'location' : {$regex:"Dhaka"}}).sort({vacancy : -1}).limit(3).toArray();
            res.send(result)
        })
        app.get('/foreign-top-company', async(req,res)=>{
            const result = await jobPostCollection.find({'location' : {$not : {$regex:"Dhaka"}}}).sort({vacancy : -1}).limit(3).toArray();
            res.send(result)
        })
        app.post('/appliedJob', async (req, res) => {
            const item = req.body;
            const result = await AppliedJobCollection.insertOne(item);
            res.send(result)
          })


        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('job portal is running')
})
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})