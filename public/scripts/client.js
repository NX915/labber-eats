const cart = {};
// const cart = { itemId: 'quantity' };
// const userDetails = { name: 'qleqe', phone: '12341839254'}
// { cart: {},

const createItemElement = itemObj => {
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

const renderMenu = arr => {
  arr.forEach(item => $('main').append(createItemElement(item)));
};

$(document).ready(() => {
  $.ajax({url: '/items', method: 'get'})
    .then(res => {
      renderMenu(res);
    })
    .then(() => {
      $('.dec-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        if ($counter.val() > 0) {
          $counter.val(Number($counter.val()) - 1)
        }

        if (cart[clickedItemId]) {
          if (cart[clickedItemId] > 1) {
            cart[clickedItemId]--;
          } else if (cart[clickedItemId] === 1) {
            delete cart[clickedItemId];
          }
        }
        console.log(cart)
      });

      $('.inc-button').click(function() {
        const clickedItemId = $(this).parent().parent().attr('id');
        let $counter = $(this).siblings('input');

        $counter.val(Number($counter.val()) + 1)

        if (cart[clickedItemId]) {
          cart[clickedItemId]++;
        } else {
          cart[clickedItemId] = 1;
        }
        console.log(cart)
      });
    });
});
