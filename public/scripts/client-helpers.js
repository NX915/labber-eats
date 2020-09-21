/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// const { selectedItems: { itemId: 'quantity' }, userDetails:{ name: 'qleqe', phone: '12341839254'}}

const createItemElement = (itemObj) => {
  let $item = `
  <article class='menu-item' id=${itemObj.id}>
    <div><img src=${itemObj.image_url} width="500"></div>
    <div>
        <h3>${itemObj.name}</h3>
        <p>${itemObj.description}</p>
        <p>$${itemObj.price / 100}</p>
    </div>
  `;
  if (!itemObj.available) {
    $item += `
      <div class='unavailable'>`;
  } else {
    $item += `
    <div>`;
  }
  $item += `
      <button class='dec-button'>-</button>
      <input type="number" name="quantity" value="0">
      <button class='inc-button'>+</button>
    </div>
  </article>`;
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
      <p class='subtotal'>$${(itemObj.price * quant / 100).toFixed(2)}</p>
    </div>
  </article>
  `;
  return $item;
};

const renderMenu = arr => {
  arr.forEach(item => $('main').append(createItemElement(item)));
};

const renderCartItems = (arr, cart) => {
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

const renderCartPage = (menu, items) => {
  $('main').empty();
  $('main').append('<h1>Cart</h1>');
  renderCartItems(menu, items);
  $('main').append(`
  <div>
    <h4>Total</h4>
    <p id='total'>$${calculateTotal(menu, items)}</p>
  </div>
  <form method='POST' action='/orders'>
    <label for="name">Name:</label>
    <input type="text" name="name" id="name" placeholder="Name">
    <label for="phone-num">Phone number:</label>
    <input type="text" name="phone" id="phone" placeholder="(xxx)xxx-xxxx">
    <button type="submit">Submit Order</button>
  </form>
  `);
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
  return (sum / 100).toFixed(2);
};

const updateSubtotal = function(el, quant, price) {
  el.text(`$${(quant * price / 100).toFixed(2)}`);
};

const submitOrder = (order) => {
  console.log(order)
  return $.ajax({
    url: '/orders',
    type: 'post',
    data: order,
    dataType: 'json',
    contentType: 'application/json'
  });
};

const renderOrderConfirmation = () => {
  $('nav').empty();
  $('main').empty();
  $('main').append(`
  <h1>Thank you for your order!</h1>
  <p>You will receive an SMS soon!</p>`);
};

const findPrice = (id, menu) => {
  for (const item of menu) {
    if (item.id === parseInt(id)) {
      return item.price;
    }
  }
};
