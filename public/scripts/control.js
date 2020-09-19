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
      .then(orderData => {
        const { orderDetails, itemsFromOrder } = orderData;
        const $orderDiv = `
          <li id='order_id_${orderId}'>
            <h2>Order ${orderId}</h2>
            <p>@ ${orderDetails.created_at}</p>
            <p>For ${orderDetails.name} (${orderDetails.phone})</p>
            <ul></ul>
            <p>Order Total: $${orderDetails.total / 100}</p>
            <form method='POST' action='/orders/${orderId}'>
              <label for='wait-time'>Wait Time: </label>
              <input name='wait-time' placeholder='Default 20'>
              <input type='submit' value='Accept'>
            </form>
            <form method='POST' action='/orders/${orderId}/decline'>
              <label for='decline'>Message: </label>
              <input name='decline' placeholder='Sorry! We cannot take orders right now'>
              <input type='submit' value='Decline'>
            </form>
          </li>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li>x${ele.quantity} ${ele.name}</li>`;
        }

        $('#new_orders').append($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);
      });
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
