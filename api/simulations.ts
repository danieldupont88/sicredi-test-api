import { Simulation, SimulationStatus } from "../models/simulation";

// Import Dependencies
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');

// Create cached connection variable
let cachedDb = null;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
    // If the database connection is cached,
    // use it instead of creating a new connection
    if (cachedDb) {
        return cachedDb;
    }

    // If no connection is cached, create a new one
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });

    // Select the database through the connection,
    // using the database path of the connection string
    const db = await client.db(url.parse(uri).pathname.substr(1));

    // Cache the database connection and return the connection
    cachedDb = db;
    return db;
}

function decodeJWT(req){
    const token = req.headers['x-access-token'];
    if (!token) {
        throw { error: 'Token de autenticação é obrigatório no header "x-access-token"', status: 401 };
    }
    return jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
        if (err) throw { error: 'Token de autenticação expirado ou inválido', status: 500 };
        return decoded.id;
    });
}

module.exports = async (req, res) => {

    try {
        //validate token and extract user
        const user = decodeJWT(req);

        // Get a database connection, cached or otherwise,
        // using the connection string environment variable as the argument
        const db = await connectToDatabase(process.env.MONGODB_URI);

        // Select the "simulations" collection from the database
        const collection = await db.collection('simulations');


        if (req.method === 'GET') {
            const { id } = req.query;
            if (id) {
                const simulation = await collection.findOne(new ObjectId(id));
                return res.status(200).json(simulation);
            } else {
                const simulations = await collection.find({ssn: user}).toArray();
                return res.status(200).json(simulations);
            }
        }

        if (req.method === 'POST') {
            const { requestedAmount, totalAmount, installmentsNumber, monthlyInterest, status}  = req.body;
            const simulation = new Simulation();
            simulation.ssn = user;
            simulation.requestedAmount = requestedAmount;
            simulation.totalAmount = totalAmount;
            simulation.installmentsNumber = installmentsNumber;
            simulation.monthlyInterest = monthlyInterest;
            simulation.status = status as SimulationStatus;

            simulation.validate();

            const { ops } = await collection.insertOne(simulation);
            res.status(200).json(ops[0]);
        }

        if (req.method === 'PUT') {
            const { id } = req.query;
            const { status }  = req.body;
            const updatedSimulation = await collection.findOneAndUpdate( { "_id": ObjectId(id) }, {$set: { status }});
            res.json(updatedSimulation.value);
        }

        if (req.method === 'DELETE') {
            const { id } = req.query;
            const { status }  = req.body;
            const deletedSimulation = await collection.findOneAndDelete( { "_id": ObjectId(id) });
            res.json(deletedSimulation);
        }

    } catch (e) {
        console.error(e);
        res.status(e.status);
        res.json(e);
    }
}
