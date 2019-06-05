$(document).ready(function(){
    //Array of objects for all the food items.
    var foodItems = [
        {
            type: 'buns',
            items: [
                {
                    id: 1,
                    title: 'bun1',
                    price: 1,
                    image: 'bun1-top.png'
                },
                {
                    id: 2,
                    title: 'bun2',
                    price: 2,
                    image: 'bun2-top.png'
                },
                {
                    id: 3,
                    title: 'bun3',
                    price: 3,
                    image: 'bun3-top.png'
                }
            ]
        },
        {
            type: 'meats',
            items: [
                {
                    id: 4,
                    title: 'meat 1',
                    price: 4,
                    image: 'meat1.png'
                },
                {
                    id: 5,
                    title: 'meat 2',
                    price: 5,
                    image: 'meat2.png'
                },
                {
                    id: 6,
                    title: 'meat 2',
                    price: 6,
                    image: 'meat3.png'
                }
            ]
        },
        {
            type: 'cheeses',
            items: [
                {
                    id: 7,
                    title: 'cheese1',
                    price: 7,
                    image: 'cheese1.png'
                },
                {
                    id: 8,
                    title: 'cheese2',
                    price: 8,
                    image: 'cheese2.png'
                },
                {
                    id: 9,
                    title: 'cheese3',
                    price: 9,
                    image: 'cheese3.png'
                }
            ]
        },
        {
            type: 'salads',
            items: [
                {
                    id: 10,
                    title: 'tomato',
                    price: 10,
                    image: 'tomato.png'
                },
                {
                    id: 11,
                    title: 'lettuce',
                    price: 11,
                    image: 'lettuce.png'
                },
                {
                    id: 12,
                    title: 'onion',
                    price: 12,
                    image: 'onion.png'
                }
            ]
        }
    ]

    // Loop over the array to render out all the food on the front end.
    // This needs to happen before we add the draggable functions.
    for (var i = 0; i < foodItems.length; i++) {
        var div = '<div class="row border-bottom py-3 mx-2 align-items-center '+foodItems[i].type+'">';
            div += '<div class="col-12"><h5>'+foodItems[i].type+'</h5></div>';
            // Loop over all the items in each of the foodItems objects
            for (var j = 0; j < foodItems[i].items.length; j++) {
                div += '<div class="col-4 p-1 draggable foodItem '+foodItems[i].type+'" data-id="'+foodItems[i].items[j].id+'" data-type="'+foodItems[i].type+'" data-name="'+foodItems[i].items[j].title+'">';
                    div += '<img src="images/'+foodItems[i].items[j].image+'" class="img-fluid" alt="">';
                div += '</div>';
            }
        div += '</div>';
        $('#fillings').append(div);
    }

    var totalPrice = 0;
    var hovering = false;

    // turn all items with .draggable to be draggable.
    // Issue is that it will only add it to items that were there on the initial load.
    // so we have to put it in a function which gets rendered both when load the page as well as whenever we clone an item.
    // If we didnt do this then we wouldn't be able to move items out of the burger once we have dropped it in.
    function createDraggableItems(){
        $('.draggable').draggable({
            containment: '#burgerContainer',
            helper: 'clone',
            drag: function(event, ui){
                // while dragging the items, check to see if that item has the class of added.
                // If it does, that means we are moving an item that was already placed in the burger and we are probably wanting to remove it.
                if(ui.helper.hasClass('added')){
                    if(hovering === false){
                        // if the element I am dragging isn't on the appropriate droppable area
                        // if I let go, it will mean I want to remove it
                        ui.helper.addClass('remove');
                    } else {
                        // if the element is over an appropriate droppable area
                        // this means I don't want to remove it
                        ui.helper.removeClass('remove');
                    }
                }
            },
            stop: function(event, ui){
                // if I stop dragging an element with the class of added, and it isn't on top of an appropriate droppable area.
                if(ui.helper.hasClass('added') && hovering === false){
                    var idToRemove = $(this).data('id');
                    var productToRemove = getSingleProduct(idToRemove);
                    totalPrice = totalPrice - productToRemove.price;
                    var itemType = $(this).data('type');
                    $(this).remove();
                    ui.helper.remove();
                    var dropAreas = $('.droppableArea');
                    dropAreas.each(function(i){
                        if($(this).data('type') === itemType){
                            $(this).addClass('bashedBorder invalid').removeClass('valid').append('<p>Choose your '+itemType+'</p>');
                            if(itemType === 'buns'){
                                $('#bunBottom').empty();
                            }
                            return false;
                        }
                    });
                }
                $('#totalPrice').text(totalPrice.toFixed(2));
                // This checks to see if the height of your burger container is bigger than the container itself.
                // If it is, then it will scale your burger to fit.
                checkHeight();
            }
        });
    }

    // call the function on load
    createDraggableItems();

    //Create a droppable area for the buns
    $('#topDroppable').droppable({
        accept: '.buns',
        over: function(event, ui){
            $(this).addClass('hovering');
            hovering = true;
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
            hovering = false;
        },
        drop: function( event, ui ) {
            // Clone the item which is being dropped in and remove the columns as well as add a new class to tell it has been added
            var element = ui.draggable.clone().removeClass('col-4').addClass('added');
            // This happens on all 4 droppable areas so we just run the function and pass though the values.
            // The first value is the droppable container and the second is the id of the item which is being dropped in and the third is the element which was just cloned
            checkValidAndPrice($(this), ui.draggable.data('id'), element);
            // You are only allowed one type of bun, so remove the bun that is already there
            $(this).empty();
            // Add that cloned item to the droppable container
            $(this).append(element);
            // call the create draggable items function again.
            // This is so that the newly cloned and appended item can also have the ability to drag.
            // This is because that item didn't exist when we first turned all the items draggable.
            createDraggableItems();
            // Get the name for the image needed for the bottom part of the burger
            var imageName = element.data('name');
            // empty and then add the bottom burger bun into the container for the bun
            $('#bunBottom').empty().append('<div class="col p-1"><img class="img-fluid" src="images/'+imageName+'-bottom.png"></div>');
        }
    });

    //Create a droppable area for meats
    $('#meatDroppable').droppable({
        accept: '.meats',
        over: function(event, ui){
            $(this).addClass('hovering');
            hovering = true;
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
            hovering = false;
        },
        drop: function( event, ui ) {
            var element = ui.draggable.clone().removeClass('col-4');
            checkValidAndPrice($(this), ui.draggable.data('id'), element);
            element.addClass('added');
            $(this).append(element);
            createDraggableItems();
        }
    });

    //Create a droppable area for the cheeses
    $('#cheeseDroppable').droppable({
        accept: '.cheeses',
        over: function(event, ui){
            $(this).addClass('hovering');
            hovering = true;
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
            hovering = false;
        },
        drop: function( event, ui ) {
            var element = ui.draggable.clone().removeClass('col-4').addClass('added');
            checkValidAndPrice($(this), ui.draggable.data('id'), element);
            $(this).append(element);
            createDraggableItems();
        }
    });

    //Create a droppable area for salads
    $('#saladDroppable').droppable({
        accept: '.salads',
        over: function(event, ui){
            $(this).addClass('hovering');
            hovering = true;
        },
        out: function(event, ui){
            $(this).removeClass('hovering');
            hovering = false;
        },
        drop: function(event, ui){
            var element = ui.draggable.clone().removeClass('col-4').addClass('added');
            checkValidAndPrice($(this), ui.draggable.data('id'), element);
            $(this).append(element);
            createDraggableItems();
        }
    });

    function checkValidAndPrice(container, id, element){
        //run the function which gets back the food item that matches the id
        var product = getSingleProduct(id);
        // add the price of the newly added piece to the total
        totalPrice = totalPrice + product.price;
        // Check to see if the container has a class of invalid. it should only have the class if there is nothing inside of it
        if(container.hasClass('invalid')){
            // remove the class if does contain it.
            container.removeClass('invalid').addClass('valid');
        } else {
            if(element.hasClass('added') && hovering === false){
                // This will trigger if an element that is dropped has already been added into the burger
                // Find the id of the item which is already there
                var idToRemove = container.find('.foodItem').first().data('id');
                // tun the same function as before to find all the details about that item
                var productToRemove = getSingleProduct(idToRemove);
                // remove the price of that item from the total
                totalPrice = totalPrice - productToRemove.price;
            }
        }
        // remove the border and empty the container.
        // this will either remove the p tag from the droppable area, or the exisiting item
        container.removeClass('bashedBorder hovering').find('p').remove();
    }

    function getSingleProduct(id){
        //Looping over food items and returning the item that the function is asking for
        for (var i = 0; i < foodItems.length; i++) {
            for (var j = 0; j < foodItems[i].items.length; j++) {
                if(foodItems[i].items[j].id === id){
                    return foodItems[i].items[j];
                }
            }
        }
    }

    function checkHeight(){
        //Get the height of the container.
        var containerHeight = $('#yourBurgerContainer').height();
        // Get the height of your burger
        var contentHeight = $('#burger').height();
        // Check to see if your burgers height is bigger than the container
        if(contentHeight > containerHeight){
            // If it is then find the right scale value needed to fit and the change the scale.
            var scale = containerHeight / contentHeight;
            $('#burger').css('transform', 'scale('+scale+')');
        }
    }

});
