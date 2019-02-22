
var socket = io.connect('http://localhost:3001');

$(document).ready(function() {
    function refreshPage() {
        socket.emit('refresh');
        socket.on('res', function(total_tuits,total_cates,total_users,user_mas,cater_mas,twets){
          $('#tot_usrs').replaceWith('<h6 class="text_inf" id="tot_usrs">Total de usuarios: '+total_users+'</h6>');
          $('#tot_tuis').replaceWith('<h6 class="text_inf" id="tot_tuis">Total de tweets: '+total_tuits+'</h6>');
          $('#tot_cats').replaceWith('<h6 class="text_inf" id="tot_cats">Total de categorias: '+total_cates+'</h6>');
          $('#usr_plus').replaceWith('<h6 class="text_inf" id="usr_plus">Usuario más activo: '+user_mas+'</h6>');
          $('#cat_plus').replaceWith('<h6 class="text_inf" id="cat_plus">Categoria destacada: '+cater_mas+'</h6>');
          $.each(twets, function (index, value) {
            $('#id_'+index).replaceWith('<span class="text_user" id="id_'+index+'">'+this.nombre+' @'+this.user+'</span>');
            $('#tui_'+index).replaceWith('<span class="text_span" id="tui_'+index+'">'+this.tweet+'</span>');
          });
          console.log("Se actualizo --> :)");
        });
    }
    setInterval(refreshPage, 3000);
});
