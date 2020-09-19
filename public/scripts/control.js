const getOrders = function(id) {
  const url = '/orders';

  return $.ajax({url: url, method: 'get'})
    .then(res => res)
    .catch(err => console.log('error ', err));
};

//take in an array of object with the key of id and value order id
//
const renderNewOrders = function(orderArr) {
  for (const ele of orderArr) {
    const orderId = ele.id;
    console.log(`id `, orderId);
  }
};

const renderAllOrders = function() {
  getOrders()
    .then(data => {
      renderNewOrders(data.newOrders);
      // renderPendingOrders(data.pendingOrders);
    });
};

$().ready(() => {
  renderAllOrders();
});
