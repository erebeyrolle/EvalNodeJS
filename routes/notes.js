var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,// declaration de ObjectId qui appartient a mongodb donc le signaler ainsi a nodejs
    url = "mongodb://localhost:27017/EvalNodeJS";
  // connexion a la db cette fonction requiert 3 parametres: une url, un objet et une function de callback
  MongoClient.connect(url,
    {useNewUrlParser:true},
    function(err, client){
      if(err) throw err;

      var DB = client.db('EvalNodeJS');

      console.log('Je suis connecté à ma liste de notes');


/* Pour obtenir toutes les notes */
router.get('/', function(req, res, next) {
    
    DB.collection('notes').find({}).toArray(function(err, notes){
        if(err) throw err;
          console.log(notes);
          res.json(notes);
        });
    });


/* Pour lire une note*/
    router.get('/:id', function(req, res, next) {
        // recupere lutilisateur dont lid est passe en parametre dans la db
        DB.collection('notes').findOne({_id: ObjectId(req.params.id)},function(err, user){
          // s'il n'y a pas d'erreur
          if(err) throw err;
    
          // renvoi ce quon a recuperer dans la db correspondant a lid 
          res.json(user);
        });
    
    });

  /* Pour créer une note */  
  router.post('/', function(req, res, next) {
  
    var requiredProps = ['title','content', 'dateCreate', 'dateModify'];
    // je verifie qu'il y ai bien des données reçues en post.
    for(var i in requiredProps[i]) {
      // si les données reçue est indefinie répond que le champ est vide et coupe le script avec le return
      if(typeof req.body[requiredProps[i]] == 'undefined'){
        return res.send(requiredProps[i] + 'empty');
      }
    }
    // si les données reçues ne sont pas indefinis alors tu les insert dans la DB et tu affiche ok + toutes les données corespondant a l'id
    DB.collection('notes').insertOne(req.body, function(err, result){
      
      if(err) throw err;
  
        res.json({
          result : 'ok',
          id : result.insertedId.toString()
        });
  
    });
  
  
  });

  /* Pour modifier une note */
  router.put('/:id', function(req, res, next) {

     
    var requiredProps = req.body;
   
      if(typeof requiredProps == 'undefined'){
      //return res.send(requiredProps[i] + 'empty');
      return res.send(requiredProps + 'empty');
    }
  
    //  update dans la DB ou id = params id et tu affiche ok
    // connectednotes.get(req.cookies.token);
    DB.collection('notes').updateOne(
        {_id: ObjectId(req.params.id)},
              {$set:req.body},  
        function(err, result){
          if(err) throw err;
            res.json({
            result : 'Votre note à bien été modifiée'
            });
            console.log(res.body);
        });
  });


  /* Pour effacer une note */
  router.delete('/:id', function(req, res, next) {
    // recupere lutilisateur dont lid est passe en parametre dans la db
    DB.collection('notes').deleteOne({_id: ObjectId(req.params.id)},function(err, user){
      if(err) throw err;
      res.send('La note a bien été supprimée');
    });
  });

});
module.exports = router;
