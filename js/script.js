$(document).ready(function(){
    var totalPrice = 0;

    $('.draggable').draggable({
        containment: '#burgerContainer',
        helper: 'clone',
        stop: function(event, ui){
            $('#totalPrice').text(totalPrice.toFixed(2))
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
            checkValidAndPrice($(this), ui.draggable.data('price'));
            var element = ui.draggable.clone().removeClass('col-4');
            $(this).append(element);
            var id = element.data('bun');
            $('#bunBottom').empty().append('<div class="col p-1"><img class="img-fluid" src="images/bun'+id+'-bottom.png"></div>');
        }
    });

    $('#meatDroppable').droppable({
        accept: '.meat',
        over: function(event, ui){
            $(this).addClass('hovering');
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
        },
        drop: function( event, ui ) {
            checkValidAndPrice($(this), ui.draggable.data('price'));
            var element = ui.draggable.clone().removeClass('col-4');
            $(this).append(element);
        }
    });

    $('#cheeseDroppable').droppable({
        accept: '.cheese',
        over: function(event, ui){
            $(this).addClass('hovering');
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
        },
        drop: function( event, ui ) {
            checkValidAndPrice($(this), ui.draggable.data('price'));
            var element = ui.draggable.clone().removeClass('col-4');
            $(this).append(element);
        }
    });

    $('#saladDroppable').droppable({
        accept: '.salad',
        over: function(event, ui){
            $(this).addClass('hovering');
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
        },
        drop: function(event, ui){
            checkValidAndPrice($(this), ui.draggable.data('price'));
            var element = ui.draggable.clone().removeClass('col-4');
            $(this).append(element);
        }
    });




    function checkValidAndPrice(container, price){
        totalPrice = totalPrice + price;
        if(container.hasClass('invalid')){
            container.removeClass('invalid').addClass('valid');
        } else {
            var priceRemove = container.find('.foodItem').first().data('price');
            totalPrice = totalPrice - priceRemove;
        }
        container.removeClass('bashedBorder hovering').empty();
    }



});
