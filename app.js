var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var api_init = require('./routes/api');


function app_init(db,http){

  var app = express();
  //var io = require('socket.io').listen(app.listen(3000));

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/index', indexRouter);
  app.use('/users', usersRouter);
  app.use('/',api_init(db));

  //---------------------SOCKET IO
    const port_sock=3001;
    const server = app.listen(port_sock, () => {
      console.log(`Socket io running on port ${port_sock}`)
    })//*/
    const io = require('socket.io').listen(server)

    //cpaura de datos
    var tuits_collection = db.collection('tuits');
    var total_tuits;
    var total_cates;
    var total_users;
    var user_mas;
    var cater_mas;
    var twets=[];

    io.on('connection', function(socket) {
      console.log('a user connected');
      socket.on('refresh', function(){
       //Sumamos el click
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
       //Emitimos el evento que dirá al cliente que hemos recibido el click
       //y el número de clicks que llevamos
       setTimeout(function(){
         console.log('Se respondio al user con ->'+total_tuits);
         socket.emit('res',total_tuits,total_cates,total_users,user_mas,cater_mas,twets);
       },70);
     });
   });//*/
  //---------------------SOCKET IO

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}

module.exports = app_init;
