// Import Dependencies
const url = require('url');
const MongoClient = require('mongodb').MongoClient;
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
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
        if (err) throw { error: 'Token de autenticação expirado ou inválido', status: 500 };
        return decoded.id;
    });
}

module.exports = async (req, res) => {

    try {
        //validate token and extract user
        const user= decodeJWT(req);

        // Get a database connection, cached or otherwise,
        // using the connection string environment variable as the argument
        const db = await connectToDatabase(process.env.MONGODB_URI);

        // Select the "simulations" collection from the database
        const collection = await db.collection('simulations');

        //
        if (req.method === 'GET') {
            const simulations = await collection.find({}).toArray();
            res.status(200).json({ simulations });
        }

        if (req.method === 'POST') {
            res.json(simulations.push(1));
        }

    } catch (e) {
        console.log(e);
        res.status(e.status);
        res.json(e);
    }
}
