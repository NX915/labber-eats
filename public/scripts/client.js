/* eslint-disable no-undef */
const selectedItems = {};
let menuCache;

$(document).ready(() => {
  $.ajax({url: '/items', method: 'get'})
    .then(res => {
      menuCache = res;
      console.log(menuCache)
      renderMenu(res);
    })
    .then(() => {
      // Decrease quantity when '-' clicked
      $('.dec-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        decreaseCounter($counter);
        removeFromCart(selectedItems, clickedItemId);
      });

      // Increase quantity when '+' clicked
      $('.inc-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        increaseCounter($counter);
        addToCart(selectedItems, clickedItemId);
      });

      // Update quantity when use types in the input field
      $('input').on('input', function() {
        const itemId = $(this).parent().parent().attr('id');
        const inputValue = $(`#${itemId}`).find('input').val();

        updateCart(selectedItems, itemId, inputValue);
      });

      // When client clicks on cart, repopulate page with only their selection
      $('#cart-btn').click(() => {
        renderCartPage(menuCache, selectedItems);

        // Decrease quantity when '-' clicked and updates subtotal + total
        $('.dec-button').click(function() {
          const clickedItemId = $(this).parent().parent().attr('id');
          const $subTotalEl = $(this).parent().parent().find('.subtotal');
          let $counter = $(this).siblings('input');
          const price = findPrice(clickedItemId, menuCache);

          decreaseCounter($counter);
          removeFromCart(selectedItems, clickedItemId);
          updateSubtotal($subTotalEl, Number($counter.val()), price);
          $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
        });

        // Increase quantity when '+' clicked and updates subtotal + total
        $('.inc-button').click(function() {
          const clickedItemId = $(this).parent().parent().attr('id');
          const $subTotalEl = $(this).parent().parent().find('.subtotal');
          let $counter = $(this).siblings('input');
          const price = findPrice(clickedItemId, menuCache);

          increaseCounter($counter);
          addToCart(selectedItems, clickedItemId);
          updateSubtotal($subTotalEl, Number($counter.val()), price);
          $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
        });

        // Update quantity when use types in the input field
        $('input[name$="quantity"]').on('input', function() {
          const itemId = $(this).parent().parent().attr('id');
          const $subTotalEl = $(this).parent().parent().find('.subtotal');
          const inputValue = $(`#${itemId}`).find('input').val();
          const price = findPrice(itemId, menuCache);

          updateCart(selectedItems, itemId, inputValue);
          updateSubtotal($subTotalEl, Number(inputValue), price);
          $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
        });

        // Add new order to database and shows confirmation page to client
        $('form').submit(function(event) {
          event.preventDefault();
          const name = $('#name').val();
          const phone = $('#phone').val();
          const orderDetails = {selectedItems, userDetails: {name, phone}};

          submitOrder(orderDetails);
          renderOrderConfirmation();

          // submitOrderDetails(orderDetails)
          //   .done((data) => console.log(data));

          // const req = $.ajax({
          //   url: '/orders',
          //   type: 'post',
          //   dataType: 'json',
          //   contentType: 'application/json; charset=utf-8',
          //   data: orderDetails});
          // req.done(() => {
          //   console.log('hello')

        });
      });
    });
});
