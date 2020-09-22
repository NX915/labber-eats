/* eslint-disable no-undef */
const selectedItems = {};
let menuCache;

$(document).ready(() => {
  // $('#logo')
  $.ajax({url: '/items', method: 'get'})
    .then(res => {
      menuCache = res;
      console.log(res);
      renderMenu(res);

      // Disable buttons/input for unavailable items
      $('.unavailable *').prop("disabled", true);

      // Decrease quantity when '-' clicked
      $('.dec-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        decreaseCounter($counter);
        removeFromCart(selectedItems, clickedItemId);
        showCartQuantity(selectedItems);
      });

      // Increase quantity when '+' clicked
      $('.inc-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        increaseCounter($counter);
        addToCart(selectedItems, clickedItemId);
        showCartQuantity(selectedItems);
      });

      // Update quantity when use types in the input field
      $('input').on('input', function() {
        const itemId = $(this).parent().parent().attr('id');
        const inputValue = $(`#${itemId}`).find('input').val();

        updateCart(selectedItems, itemId, inputValue);
        showCartQuantity(selectedItems);
      });

      // When client clicks on cart, repopulate page with only their selection
      $('#cart-btn').click(() => {
        renderCartPage(menuCache, selectedItems);
        $('#cart').toggleClass('hidden');

        // Decrease quantity when '-' clicked and updates subtotal + total
        $('.dec-cart').click(function() {
          const clickedItemId = $(this).parent().parent().attr('id');
          let $counter = $(this).siblings('input');
          const $subTotalEl = $(this).parent().parent().find('.subtotal');
          const price = findPrice(clickedItemId, menuCache);

          decreaseCounter($counter);
          removeFromCart(selectedItems, clickedItemId);
          updateSubtotal($subTotalEl, Number($counter.val()), price);
          $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
        });

        // Increase quantity when '+' clicked and updates subtotal + total
        $('.inc-cart').click(function() {
          const clickedItemId = $(this).parent().parent().attr('id');
          let $counter = $(this).siblings('input');
          const $subTotalEl = $(this).parent().parent().find('.subtotal');
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
          const name = $('#name').val().trim();
          const rawNum = $('#phone').val().trim();
          const phone = convertNum(rawNum);
          const orderDetails = JSON.stringify({selectedItems, userDetails: {name, phone}});
          isValidPhone(phone);
          isValidCart(selectedItems);

          if (isValidName(name) && isValidPhone(phone) && isValidCart(selectedItems)) {
            submitOrder(orderDetails)
              .then(() => renderOrderConfirmation());
          }
        });
      });

    });
});
