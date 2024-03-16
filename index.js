const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')

const app = express()
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json'),
    databaseURL: "https://elotesbanus.firebaseio.com"
});

const db = admin.firestore()

app.get('/hello-world', (req, res) => {
    return res.status(200).json({message: 'Hello World'})
});

//Añadir un nuevo Producto
app.post('/api/Producto', async (req, res) => {
    try{
        await db.collection("Producto").doc("/" + req.body.id + "/").create({nombre: req.body.nombre, precio: req.body.precio, descripcion: req.body.descripcion});
    return res.status(204).json();
    }catch(error){
        console.log(error);
        return res.status(500).send(error);
    }
});

//Buscar Producto por id
app.get("/api/Producto/:id", (req, res) => {
    (async () => {
        try {
            const doc = db.collection("Producto").doc(req.params.id);
            const item = await doc.get();
            const response = item.data();
            return res.status(200).json(response);
        } catch(error){
            return res.status(500).send(error);
        }
    })();
});

//Consultar los productos en la Base de datos
app.get("/api/Producto", async (req, res) => {
    try {
    const query = db.collection("Producto");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    const response = docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
        precio: doc.data().precio,
        descripcion: doc.data().descripcion,
        
    }));
        return res.status(200).json(response);
    }   catch(error){
        return res.status(500).send(error);
    }
    });

    //Borrar Articulos por medio de id
app.delete("/api/Producto/:id", async (req, res) => {
    try {
        const doc = db.collection("Producto").doc(req.params.id);
        await doc.delete();
        return res.status(204).json();
    } catch(error){
        return res.status(500).send(error);
    }
});

//Actualizar los Productos por medio del id
app.put("/api/Producto/:id", async (req, res) => {
    try {
        const doc = db.collection("Producto").doc(req.params.id);
        await doc.update(req.body);
        return res.status(204).json();
    }catch (error) {
        return res.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);