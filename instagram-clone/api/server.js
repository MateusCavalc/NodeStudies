const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');

let app = express();

// body-parser conf
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());

const url = 'mongodb://balta:e296cd9f@localhost:27017/instagram';

app.get('/', (req, res) => {
    res.send({ msg: 'oie' });
});

// (CREATE)
app.post('/api', (req, res) => {

    let d = new Date();
    res.setHeader("Access-Control-Allow-Origin", "*");

    let sentFiles = req.files // req.files contain the files sent from origin (connect-multiparty)
    let path_origem = sentFiles.arquivo.path;

    const dot_idx = sentFiles.arquivo.originalFilename.indexOf('.');
    const serverFilename = sentFiles.arquivo.originalFilename.substr(0, dot_idx) + '_' + d.getTime() + sentFiles.arquivo.originalFilename.substr(dot_idx);
    let path_destino = './uploads/' + serverFilename;

    fs.rename(path_origem, path_destino, (err) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        let postDados = {
            url_imagem: serverFilename,
            titulo: req.body.titulo
        };

        console.log("censegui");

        MongoClient.connect(url, (err, db) => {
            if (err) res.json(err);
            db.collection('posts').insertOne(postDados, (err, rec) => {
                console.log("censegui?");
                if (err)
                    res.json(err);
                else
                    res.json(rec);
                    
                db.close();
            });
        });

    });

});

// (READ)
app.get('/api', (req, res) => {

    MongoClient.connect(url, (err, db) => {
        if (err) res.json(err)
        db.collection('posts').find().toArray((err, recArray) => {
            if (err)
                res.json(err);
            else
                res.json(recArray);

            db.close();
        });
    });

});

// (READ by id)
app.get('/api/:id', (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota 

    MongoClient.connect(url, (err, db) => {
        if (err) res.json(err)
        db.collection('posts').find({ _id: ObjectId(req.params.id) }).toArray((err, rec) => {
            if (err)
                res.json(err);
            else
                res.json(rec);
            
            db.close();
        });
    });

});

// (UPDATE by id)
app.put('/api/:id', (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota

    let novos_dados = req.body;

    MongoClient.connect(url, (err, db) => {
        if (err) res.json(err)
        db.collection('posts').update(
                {
                    _id: ObjectId(req.params.id)
                },
                {
                    $set: {
                        titulo: novos_dados.titulo
                    }
                }, {}, (err, rec) => {
                    if (err)
                        res.json(err);
                    else
                        res.json(rec);
                    
                    db.close();
                }
            );
        });

});

// (DELETE by id)
app.delete('/api/:id', (req, res) => {

    // req.params.[nome do parametro] para acessar o parâmetro passado pela rota

    MongoClient.connect(url, (err, db) => {
        if (err) res.json(err)
        db.collection('posts').remove({ _id: ObjectId(req.params.id) }, (err, rec) => {
                if (err)
                    res.json(err);
                else
                    res.json(rec);
                    
                db.close();
        });
    });
});

const port = 8080;

app.listen(port, () => {
    console.log(`Servidor ONLINE (Porta ${port})`)
});