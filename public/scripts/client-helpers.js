/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Create the element for one menu item
const createItemElement = (itemObj) => {
  let item;
  if (!itemObj.available) {
    item = `<article class='menu-item unavailable' id=${itemObj.id}>`
  } else {
    item = `<article class='menu-item' id=${itemObj.id}>`
  }
  item += `
    <div class='title'>
      <h2>${itemObj.name}</h2>
      <h2>$${itemObj.price / 100}</h2>
    </div>
    <div><img src=${itemObj.image_url} width="300"></div>
    <div class='counter'>
      <p class='item-desc'>${itemObj.description}</p>
      <button class='dec-button'>-</button>
      <input type="number" name="quantity" value="0">
      <button class='inc-button'>+</button>
    </div>
  </article>`;
  return item;
};

// Add items inside of main container
const renderMenu = arr => {
  const addedCategories = {}
  arr.forEach(item => {
    const {category, category_id} = item
    if (addedCategories[category] === undefined) {
      // console.log('new category:', category);
      addedCategories[category] = '';
      $('#menu-container').append(`<div id='category-${category_id}'><h2>${category}</h2></div>`)
    }
    $(`#category-${category_id}`).append(createItemElement(item))
  });
};

// Create element for one item when checking out
const createCartItem = (itemObj, quant) => {
  const $item = `
  <article id=${itemObj.id}>
    <div><img src=${itemObj.image_url} width="300"></div>
    <div>
      <h3>${itemObj.name}</h3>
    </div>
    <div>
      <button class='dec-cart'>-</button>
      <input type="number" name="quantity" value="${quant}">
      <button class='inc-cart'>+</button>
    </div>
    <div>
      <p class='subtotal'>$${(itemObj.price * quant / 100).toFixed(2)}</p>
    </div>
  </article>
  `;
  return $item;
};

// Renders the cart items
const renderCartItems = (arr, cart) => {
  for (const menuItem of arr) {
    for (const itemId in cart) {
      if (menuItem.id === parseInt(itemId)) {
        $('#cart_items_container').append(createCartItem(menuItem, cart[itemId]));
      }
    }
  }
};

// Renders cart page once cart btn pressed
const renderCartPage = (menu, items) => {
  $('#cart').empty();
  $('#cart').append('<h1>Your Cart</h1><div id="cart_items_container" class="scroll"></div>');
  renderCartItems(menu, items);
  $('#cart').append(`
  <div>
    <h4>Total</h4>
    <p id='total'>$${calculateTotal(menu, items)}</p>
  </div>
  <form method='POST' action='/orders'>
    <div id='user-name'>
      <label for="name">Name:</label>
      <input type="text" name="name" id="name" placeholder="Name">
      <p></p>
    </div>
    <div id='user-phone'>
      <label for="phone-num">Phone number:</label>
      <input type="text" name="phone" id="phone" placeholder="(xxx)xxx-xxxx" class="form-control" data-mask="(999) 999-9999">
      <p></p>
    </div>
    <div>
      <button type="submit">Order Now</button>
      <p id='cart-err'></p>
    </div>
  </form>
  `);
};

const decreaseCounter = function (el) {
  if (el.val() > 0) {
    el.val(parseInt(el.val()) - 1);
  }
};

const increaseCounter = function (el) {
  el.val(parseInt(el.val()) + 1);
};

const removeFromCart = function (cart, id) {
  if (cart[id]) {
    if (cart[id] > 1) {
      cart[id]--;
    } else if (cart[id] === 1) {
      delete cart[id];
    }
  }
};

const addToCart = function (cart, id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
};

const updateCart = function (cart, id, value) {
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
  return (sum / 100).toFixed(2);
};

const updateSubtotal = function (el, quant, price) {
  el.text(`$${(quant * price / 100).toFixed(2)}`);
};

const submitOrder = (order) => {
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

const isValidName = name => {
  if (!name) {
    // display error
    $('#user-name').find('p').text('Please enter your name.');
    return false;
  } else if (!/^[a-zA-Z- ]*$/.test(name)) {
    $('#user-name').find('p').text('Please enter a valid name.');
    return false;
  }
  $('#user-name').find('p').empty();
  return true;
};

const isValidPhone = number => {
  if (!number) {
    $('#user-phone').find('p').text('Please enter your phone number.');
    return false;

  } else if (!/^[0-9- +()]*$/.test(number)) {
    $('#user-phone').find('p').text('Please enter a valid phone number.');
    return false;

  } else if (number.replace(/\s|-/g, "").length > 11) {
    $('#user-phone').find('p').text('Please enter a valid phone number.');
    return false;
  }
  $('#user-phone').find('p').empty();
  return true;
};

const convertNum = number => {
  const newNum = number.replace(/\D/g, '');
  if (newNum.length === 10) {
    return newNum;
  } else if (newNum.length === 11) {
    return newNum.slice(1);
  }
};

const isValidCart = obj => {
  if (Object.keys(obj).length === 0) {
    $('#cart-err').text('Please add items to your order.');
    return false;
  }
  return true;
};

const showCartQuantity = obj => {
  let amount = 0;
  for (item in obj) {
    amount += obj[item];
  }
  $('span').text(` ${amount} `);
};
