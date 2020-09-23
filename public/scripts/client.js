/* eslint-disable no-undef */
const selectedItems = {};
let menuCache;

$(document).ready(() => {
  $.get('/items').then(res => {
    menuCache = res;
    renderMenu(res);

    // Disable unavailable items
    $('.unavailable *').prop("disabled", true);

    // Decrease quantity when '-' clicked
    $('.dec-button').click(function() {
      const itemId = $(this).parent().parent().attr('id');
      let $counter = $(this).siblings('input');

      updateCart(selectedItems, itemId, -1);
      updateCounter(selectedItems, itemId, $counter);
      showCartQuantity(selectedItems);
    });

    // Increase quantity when '+' clicked
    $('.inc-button').click(function() {
      const itemId = $(this).parent().parent().attr('id');
      let $counter = $(this).siblings('input');

      updateCart(selectedItems, itemId, 1);
      addCartElement($('#cart_items_container'), menuCache, itemId, selectedItems);
      updateCounter(selectedItems, itemId, $counter);
      showCartQuantity(selectedItems);
    });

    // Update quantity when use types in the input field
    $('input').on('input', function() {
      const itemId = $(this).parent().parent().attr('id');
      const inputValue = $(`#${itemId}`).find('input').val();

      updateCart(selectedItems, itemId, inputValue);
      if (inputValue && inputValue > 0) {
        addCartElement($('#cart_items_container'), menuCache, itemId, selectedItems);
      }
      showCartQuantity(selectedItems);
    });

    // When client clicks on cart, repopulate page with only their selection
    $('#cart-btn').click(() => {
      $('#cart-container').toggleClass('hidden');

      // Decrease quantity when '-' clicked and updates subtotal + total
      $('.dec-cart').click(function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        let $counter = $(this).siblings('input');
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, -1);
        updateCounter(selectedItems, itemId, $counter);
        updateSubtotal($subTotalEl, Number($counter.val()), price);
        $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
      });

      // Increase quantity when '+' clicked and updates subtotal + total
      $('.inc-cart').click(function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        let $counter = $(this).siblings('input');
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, 1);
        updateCounter(selectedItems, itemId, $counter);
        updateSubtotal($subTotalEl, Number($counter.val()), price);
        $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
      });

      // Update quantity when user types in the input field
      $('input[name$="quantity"]').on('input', function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const inputValue = $(`.cart-${itemId}`).find('input').val();
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, inputValue);
        updateSubtotal($subTotalEl, Number(inputValue), price);
        $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
      });

      //Update comment character counter
      $('#comment').on('input', () => {
        changeCharCounter($('#user-comment').find('p'), 250, $('#comment').val().length);
      });

      // Add new order to database and shows confirmation page to client
      $('form').submit(function(event) {
        event.preventDefault();
        const name = $('#name').val().trim();
        const phone = convertNum($('#phone').val());
        const comment = $('#comment').val();
        const orderDetails = JSON.stringify({selectedItems, orderDetails: {name, phone, comment}});

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
