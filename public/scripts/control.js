//make ajax request for all the active order id, or get order details for one order if an id is passed in
const getOrders = function(id) {
  const url = id === undefined ? '/orders' : `/orders/${id}`;

  return $.ajax({url: url, method: 'get'})
    .then(res => res)
    .catch(err => console.log('error ', err));
};

//take in an array of object with the key of id and value order id
//
const renderNewOrders = function(orderArr) {
  for (const ele of orderArr) {
    const orderId = ele.id;
    getOrders(orderId)
      .then(data => console.log(`new order `, data));
  }
};

//get and render all active orders
const renderAllOrders = function() {
  getOrders()
    .then(data => {
      renderNewOrders(data.newOrders);
      // renderPendingOrders(data.pendingOrders);
    });
};

//driver code
$().ready(() => {
  renderAllOrders();
});
