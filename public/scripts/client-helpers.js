/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Create the element for one menu item
const createItemElement = (itemObj) => {
  let item;
  if (!itemObj.available) {
    item = `<article class='menu-item unavailable' id=${itemObj.id}>`;
  } else {
    item = `<article class='menu-item' id=${itemObj.id}>`;
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

const createCategoryElement = (item) => {
  const { category, category_id, category_description } = item;
  const element = `
    <div id='category-${category_id}' class='category-container'>
      <h2>${category}</h2>
      <h3 class='category-description'>${category_description}</h3>
    </div>`
  return element;
}

// Add items inside of main container
const renderMenu = arr => {
  const addedCategories = {}
  arr.forEach(item => {
    const { category, category_id } = item
    if (addedCategories[category] === undefined) {
      addedCategories[category] = '';
      $('#menu-container').append(createCategoryElement(item))
    }
    $(`#category-${category_id}`).append(createItemElement(item))
  });
};

// Create element for one item when checking out
const createCartItem = (itemObj, quant) => {
  const $item = `
  <article class=cart-${itemObj.id}>
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

// Add item details to cart
const addCartElement = ($container, menu, id, cart) => {
  const quantity = findQuantity(id, cart);
  let itemObj = getItemDetails(id, menu);

  // if item does not exist in cart, append it
  if ($container.children(`.cart-${id}`).length === 0) {
    const $item = $(createCartItem(itemObj, quantity));
    $($container).append($item);

    // ADD EVENT LISTENERS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@update to unhardcode
    // Decrease quantity when '-' clicked and updates subtotal + total
    $item.find('.dec-cart').click(function() {
      const itemId = $(this).parent().parent().attr('class').replace("cart-","");
      const $cartCount = $(this).siblings('input');
      const $menuCount = $(`#${itemId} input`);
      const $subTotalEl = $(this).parent().parent().find('.subtotal');

      updateCart(selectedItems, itemId, -1);
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      updateTotals($subTotalEl, $('#total'), itemId, menuCache, selectedItems);
      showCartQuantity(selectedItems);
    });

    // Increase quantity when '+' clicked and updates subtotal + total
    $item.find('.inc-cart').click(function() {
      const itemId = $(this).parent().parent().attr('class').replace("cart-","");
      const $cartCount = $(this).siblings('input');
      const $menuCount = $(`#${itemId} input`);
      const $subTotalEl = $(this).parent().parent().find('.subtotal');

      updateCart(selectedItems, itemId, 1);
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      updateTotals($subTotalEl, $('#total'), itemId, menuCache, selectedItems);
      showCartQuantity(selectedItems);
    });

    // Update quantity when user types in the input field
    $item.find('input[name$="quantity"]').on('input', function() {
      const itemId = $(this).parent().parent().attr('class').replace("cart-","");
      const $cartCount = $(`.cart-${itemId}`).find('input');
      const $menuCount = $(`#${itemId} input`);
      const $subTotalEl = $(this).parent().parent().find('.subtotal');

      updateCart(selectedItems, itemId, $cartCount.val());
      updateCounter(selectedItems, itemId, $menuCount, $cartCount);
      updateTotals($subTotalEl, $('#total'), itemId, menuCache, selectedItems);
      showCartQuantity(selectedItems);
    });
  }
};

const getItemDetails = (itemId, menu) => {
  for (item of menu) {
    if (item.id === Number(itemId)) {
      return item;
    }
  }
}

const findQuantity = (id, itemObj) => {
  for (const item in itemObj) {
    if (item === id) {
      return itemObj[item];
    }
  }
  return 0;
};

const updateCounter = function (itemObj, id, menuEl, cartEl) {
  const newQuant = findQuantity(id, itemObj);
  menuEl.val(newQuant);
  cartEl.val(newQuant);
};

const updateCart = function (cart, id, value) {
  // non empty value from input field
  if (value && typeof value === 'string' && value !== '0') {
    cart[id] = parseInt(value);
  } else if (value === -1 && cart[id] + value > 0) { //decrease button clicked
    cart[id] += value;
  } else if (value === 1) { //increase button clicked
    if (cart[id]) {
      cart[id] += 1;
    } else {
      cart[id] = 1;
    }
  } else {
    delete cart[id];
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

const updateTotals = function ($subtotal, $total, id, menu, cart) {
  const price = findPrice(id, menu);
  const quantity = findQuantity(id, cart);
  $subtotal.text(`$${(quantity * price / 100).toFixed(2)}`);
  $total.text(`$${calculateTotal(menuCache, selectedItems)}`);
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
  <p>You will receive an SMS soon!</p>
  <div id='map_container'>
  <img id='map' src="https://www.mtlblog.com/u/2018/06/08/92e55894b1014e2ff5d47a3863613a1ed2872534.jpg_1200x630.jpg">
  </div`);
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
