/* eslint-disable no-undef */
const selectedItems = {};
let menuCache;

$(document).ready(() => {
  $.get('/items').then(res => {
    menuCache = res;
    renderMenu(res);

    // Disable unavailable items
    $('.unavailable *').prop("disabled", true);

    // Change quantity of cart and update totals
    $('.menu-item button').click(updateQuantityAndPrice);

    // Update quantity when use types in the input field
    $('input').on('input', function() {
      const itemId = $(this).parent().parent().attr('id');
      const $menuCount = $(`#${itemId} input`);
      const $cartCount = $(`.cart-${itemId} input`);
      const $subTotalEl = $(`.cart-${itemId} .subtotal`);

      updateCart(selectedItems, itemId, $menuCount.val());
      if ($menuCount.val() && $menuCount.val() > 0) {
        addCartElement($('#cart_items_container'), menuCache, itemId, selectedItems);
      }
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      showCartQuantity(selectedItems);
      updateTotals($subTotalEl, $('.total h3:last-child'), itemId, menuCache, selectedItems);
    });

    //Update comment character counter
    $('#comment').on('input', () => {
      changeCharCounter($('.user-comment').find('p'), 250, $('#comment').val().length);
    });

    // Add new order to database and shows confirmation page to client
    $('form').submit(function(event) {
      event.preventDefault();
      const name = $('#name').val().trim();
      const phone = convertNum($('#phone').val());
      const comment = checkComment($('#comment'));
      const orderDetails = JSON.stringify({selectedItems, orderDetails: {name, phone, comment}});
      console.log(orderDetails);

      isValidPhone(phone);
      isValidCart(selectedItems);
      if (isValidName(name) && isValidPhone(phone) && isValidCart(selectedItems)) {
        submitOrder(orderDetails);
        renderOrderConfirmation();
      }
    });

    // Show/hide cart
    $('.cart-btn').click(() => {
      $('#cart-container').toggleClass('hidden');
      $('.checkout-btn').show();

      // hide user form
      $('.toggle').hide();

      // erase all error msgs
      $('.cart-err').empty();
      $('input[name=phone]').parent().find('p').empty();
      $('input[name=name]').parent().find('p').empty();

    });

    //Show/hide user input
    $('.checkout-btn').click(() => {
      $('.checkout-btn').hide();
      $('.toggle').show();
    });
  });
});
