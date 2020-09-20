const selectedItems = {};
let menuCache;
// const { selectedItems: { itemId: 'quantity' }, userDetails:{ name: 'qleqe', phone: '12341839254'}}

const createItemElement = (itemObj) => {
  const $item = `
  <article class='menu-item' id=${itemObj.id}>
    <div><img src=${itemObj.image_url} width="500"></div>
    <div>
        <h3>${itemObj.name}</h3>
        <p>${itemObj.description}</p>
        <p>$${itemObj.price / 100}</p>
    </div>
    <div>
      <button class='dec-button'>-</button>
      <input type="number" name="quantity" value="0">
      <button class='inc-button'>+</button>
    </div>
  </article>
  `;
  return $item;
};

const createCartItem = (itemObj, quant) => {
  const $item = `
  <article class='menu-item' id=${itemObj.id}>
    <div><img src=${itemObj.image_url} width="500"></div>
    <div>
      <h3>${itemObj.name}</h3>
    </div>
    <div>
      <button class='dec-button'>-</button>
      <input type="number" name="quantity" value="${quant}">
      <button class='inc-button'>+</button>
    </div>
    <div>
      <p>$${itemObj.price * quant / 100}</p>
    </div>
  </article>
  `;
  return $item;
};

const renderMenu = arr => {
  arr.forEach(item => $('main').append(createItemElement(item)));
};

const renderCart = (arr, cart) => {
  for (const menuItem of arr) {
    for (const itemId in cart) {
      if (menuItem.id === parseInt(itemId)) {
        $('main').append(createCartItem(menuItem, cart[itemId]));
      }
    }
  }
};

const decreaseCounter = function(el) {
  if (el.val() > 0) {
    el.val(parseInt(el.val()) - 1);
  }
};

const increaseCounter = function(el) {
  el.val(parseInt(el.val()) + 1);
};

const removeFromCart = function(cart, id) {
  if (cart[id]) {
    if (cart[id] > 1) {
      cart[id]--;
    } else if (cart[id] === 1) {
      delete cart[id];
    }
  }
};

const addToCart = function(cart, id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
};

const updateCart = function(cart, id, value) {
  if (value && value !== '0') {
    cart[id] = parseInt(value);
  } else {
    if (cart[id]) {
      delete cart[id];
    }
  }
};

const calculateTotal = (menu, itemObj) => {
  let sum = 0;
  for (const itemId in itemObj) {
    const quantity = itemObj[itemId];

    for (const menuItem of menu) {
      if (menuItem.id === parseInt(itemId)) {
        const price = menuItem.price;

        sum += quantity * price;
      }
    }
  }
  return sum / 100;
};

$(document).ready(() => {
  $.ajax({url: '/items', method: 'get'})
    .then(res => {
      menuCache = res;
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
        $('main').empty();
        $('main').append('<h1>Cart</h1>');
        renderCart(menuCache, selectedItems);
        $('main').append(`
        <div>
          <h4>Total</h4>
          <p>${calculateTotal(menuCache, selectedItems)}</p>
        </div>
        <form method='POST' action='/orders'>
          <label for="name">Name:</label>
          <input type="text" name="name" id="name" placeholder="Name">
          <label for="phone-num">Phone number:</label>
          <input type="text" name="phone" id="phone" placeholder="(xxx)xxx-xxxx">
          <button type="submit">Submit Order</button>
        </form>
        `);

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
        $('input[name$="quantity"]').on('input', function() {
          const itemId = $(this).parent().parent().attr('id');
          const inputValue = $(`#${itemId}`).find('input').val();

          updateCart(selectedItems, itemId, inputValue);
        });

        $('form').submit(function(event) {
          event.preventDefault();
          const name = $('#name').val();
          const phone = $('#phone').val();
          const json = JSON.stringify({selectedItems, userDetails: {name, phone}});

          $.ajax({
            url: '/orders',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: json});
        })
      });
    });
});
