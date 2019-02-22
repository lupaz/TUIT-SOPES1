var express = require('express');
var router = express.Router();

//api par la base de datos.
http://localhost:3000/create?usr=Lupaz&nom=Luis Paz&txt=Quisiera leer todos los dias *colegio
function router_init(db){

    var tuits_collection = db.collection('tuits');

    router.get('/api/all',function(req,res,next){
        tuits_collection.find({}).toArray(
            function(err,docs){
            if(err) return res.status(404).json({Error:"No se encontro la colección"});
            return res.json(docs);
        });
    });
    //get /all
    var total_tuits;
    var total_cates;
    var total_users;
    var user_mas;
    var cater_mas;

    var twets=[{user:"yo1",nombre:"luis Paz",tweet:"Hola mundo"},{user:"yo1",nombre:"luis Paz",tweet:"Hola mundo"}];

    router.get("/",function(req,res,next){
      //traemos todos los twets
      var consulta_tuits='{},{_id:0}';
      tuits_collection.find(consulta_tuits).sort({fecha:-1}).limit(10).toArray(
           function(err,docs){
           if(err) return res.status(404).json({Error:"No se encontro la colección"});
           twets=docs;
       });
       //traemos el total de tuits
       tuits_collection.find({}).count(function(err,count){
           //console.log(count);
           total_tuits=count;
       });

       //traemos el total de usuarios
       tuits_collection.aggregate([ { $group: { _id:{ $toLower: "$user"} } }]).toArray(function(err,users){
           total_users=users.length;
           //console.log(total_users);
       });

       //traemos el total de categorias
       tuits_collection.aggregate([ { $group: { _id:{ $toLower: "$categoria"}}}]).toArray(function(err,cates){
           //console.log(cates.length);
           total_cates=cates.length;
       });

       //traemos el usuario con mas tuits
       tuits_collection.aggregate([ { $group: { _id:{ $toLower: "$user"}, "count": { $sum: 1 } }},{ $sort:{ count:-1}},{$limit:1}]).toArray(function(err,user){
           //console.log(user[0]._id);
           if(user.length>0){
              user_mas=user[0]._id;
           }
       });

       //traemos la categoria con más tuits
       tuits_collection.aggregate([ { $group: { _id:{ $toLower: "$categoria"}, "count": { $sum: 1 } }},{ $sort:{ count:-1}},{$limit:1}]).toArray(function(err,cater){
          // console.log(cater[0]._id);
          if(cater.length>0){
              cater_mas=cater[0]._id;
          }
       });

       //return res.json({total:cater_mas});
        setTimeout(function(){
          next();
        },70);

    },function(req,res,next){
        res.render('main', { title: 'Inicio',sub_title:"Ultimos Tweets",total_tuits,total_cates,total_users,user_mas,cater_mas,twets});
    });

    var tweeet;

    router.get("/create",function(req,res,next){
        //console.log("Creacion de tuit");
        //console.log(req.query.usr);
        //console.log(req.query.nom);
        var cat = req.query.txt.split('*');
        //console.log(req.query.txt.replace('*',"#"));
        //console.log(cat[1]);
        tweeet = {
            user: req.query.usr.toString(), nombre: req.query.nom, categoria: cat[1],
            tweet: req.query.txt.replace('*', "#"), fecha: return_fecha()
        };
        next();
    },function(req,res,next){
        tuits_collection.insertOne(tweeet, function (err, resp) {
            if (err) return res.status(402).json({ Error: "No se creo  el tuit :)", resp: resp });
            return res.json({ Mensaje: "Se creo  el tuit :)", resp: resp });
        });
    });
    //--------------------------------------Perfil
    var twets2;
    var total_tuits2=0;
    var user="";
    var nombre="";

    router.post("/perfil",function(req,res,next){
      var id= req.body.user;
      user=id;
      tuits_collection.find({user:new RegExp('^' +id+ '$', 'i')},{_id:0, nombre:1,tweet:1}).sort({fecha:-1}).limit(5).toArray(
           function(err,docs){
           if(err) return res.status(404).json({Error:"No se encontro la colección"});
           twets2=docs;
           if(twets2.length > 0){
              nombre=docs[0].nombre;
           }
       });

       tuits_collection.find({user:new RegExp('^' +id+ '$', 'i')},{_id:0, nombre:1,tweet:1}).count(function(err,count){
           //console.log(count);
           total_tuits2=count;
       });

      setTimeout(function() {
             //return res.json({1:total_tuits2,2:user,3:nombre});
             next();
      },50);
    },function(req,res,next){
      res.render('perfil', { title: 'Perfil',sub_title:"Ultimos Tweets",total_tuits2,user,nombre,twets2});
    });

    //--------------------------------------categoria
    router.post("/categoria",function(req,res,next){
      var id= req.body.categoria;
      user=id;
      tuits_collection.find({categoria:new RegExp('^' +id+ '$', 'i')},{_id:0, nombre:1,tweet:1}).sort({fecha:-1}).limit(5).toArray(
           function(err,docs){
           if(err) return res.status(404).json({Error:"No se encontro la colección"});
           twets2=docs;
       });

       tuits_collection.find({categoria:new RegExp('^' +id+ '$', 'i')},{_id:0, nombre:1,tweet:1}).count(function(err,count){
           //console.log(count);
           total_tuits2=count;
       });

      setTimeout(function() {
             //return res.json({1:total_tuits2,2:user,3:nombre});
             next();
      },50);
    },function(req,res,next){
      res.render('categoria', { title: 'Perfil',sub_title:"Ultimos Tweets",total_tuits2,user,nombre,twets2});
    });

    return router;
}

function return_fecha(){
    var date = new Date();
    var hour = date.getHours()*60*60;
    var min = date.getMinutes()*60;
    var sec = date.getSeconds();
    var year = date.getFullYear()*360*24*60*60;
    var month = (date.getMonth())*30*24*60*60;
    var day = date.getDate()*24*60*60;
    return hour+min+sec+year+month+day;
}

module.exports=router_init;
