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
      const $menuCount = $(this).siblings('input');
      const $cartCount = $(`.cart-${itemId} input`);

      updateCart(selectedItems, itemId, -1);
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      showCartQuantity(selectedItems);
    });

    // Increase quantity when '+' clicked
    $('.inc-button').click(function() {
      const itemId = $(this).parent().parent().attr('id');
      const $menuCount = $(this).siblings('input');
      const $cartCount = $(`.cart-${itemId} input`);

      updateCart(selectedItems, itemId, 1);
      addCartElement($('#cart_items_container'), menuCache, itemId, selectedItems);
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      showCartQuantity(selectedItems);
    });

    // Update quantity when use types in the input field
    $('input').on('input', function() {
      const itemId = $(this).parent().parent().attr('id');
      const $menuCount = $(`#${itemId} input`);
      const $cartCount = $(`.cart-${itemId} input`);

      updateCart(selectedItems, itemId, $menuCount.val());
      if ($menuCount.val() && $menuCount.val() > 0) {
        addCartElement($('#cart_items_container'), menuCache, itemId, selectedItems);
      }
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      showCartQuantity(selectedItems);
    });

    // When client clicks on cart, repopulate page with only their selection
    $('#cart-btn').click(() => {
      $('#cart-container').toggleClass('hidden');

      // Decrease quantity when '-' clicked and updates subtotal + total
      $('.dec-cart').click(function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        const $cartCount = $(this).siblings('input');
        const $menuCount = $(`#${itemId} input`);
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, -1);
        updateCounter(selectedItems, itemId, $menuCount, $cartCount);
        updateSubtotal($subTotalEl, Number($cartCount.val()), price);
        $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
      });

      // Increase quantity when '+' clicked and updates subtotal + total
      $('.inc-cart').click(function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        const $cartCount = $(this).siblings('input');
        const $menuCount = $(`#${itemId} input`);
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, 1);
        updateCounter(selectedItems, itemId, $menuCount, $cartCount);
        updateSubtotal($subTotalEl, Number($cartCount.val()), price);
        $('#total').text(`$${calculateTotal(menuCache, selectedItems)}`);
      });

      // Update quantity when user types in the input field
      $('input[name$="quantity"]').on('input', function() {
        const itemId = $(this).parent().parent().attr('class').replace("cart-","");
        const $cartCount = $(`.cart-${itemId}`).find('input');
        const $menuCount = $(`#${itemId} input`);
        const $subTotalEl = $(this).parent().parent().find('.subtotal');
        const price = findPrice(itemId, menuCache);

        updateCart(selectedItems, itemId, $cartCount.val());
        updateCounter(selectedItems, itemId, $menuCount, $cartCount);
        updateSubtotal($subTotalEl, Number($cartCount.val()), price);
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
