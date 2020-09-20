// const selectedItems = { item_id: quantity, };
// const userDetails = { name: 'qleqe', phone: '12341839254'}
// { selectedItems: {},
let menuCache;

const createItemElement = itemObj => {
  const $item = `
  <article class='menu-item' id=item_id_${itemObj.item_id}>
    <div><img src=${itemObj.image_url} width="500"></div>
    <div>
        <h3>${itemObj.name}</h3>
        <p>${itemObj.description}</p>
        <p>$${itemObj.price / 100}</p>
    <div>
    <div>
      <button class='dec button'>-</button>
      <input type="text" name="${itemObj.item_id}" id="${itemObj.item_id}" value="0">
      <button class='inc button'>+</button>
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
      menuCache = res;
      renderMenu(res);
    });
});
