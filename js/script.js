$(document).ready(function(){

    $('.draggable').draggable({
        containment: "#burgerContainer",
        helper: "clone",
        drag: function(event, ui){

        }
    });

    $('#topDroppable').droppable({
        accept: '.buns',
        over: function(event, ui){
            $(this).addClass('hovering');
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
        },
        drop: function( event, ui ) {
            $(this).removeClass('bashedBorder hovering').empty();
            var element = ui.draggable.clone().removeClass('col-4').addClass('col');
            $(this).append(element);
        }
    });

});
