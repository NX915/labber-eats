let orderIDCache;
let orderDataCache;
let newOrdersCache;
let pendingOrdersCache;

//make ajax request for all the active order id, or get order details for one order if an id is passed in
const getOrders = function(id) {
  const url = id === undefined ? '/orders' : `/orders/${id}`;

  return $.ajax({url: url, method: 'get'})
    .then(res => res)
    .catch(err => console.log('error ', err));
};

//request all the order details for a given array of order id and return the data in a promise
const getOrderDetails = function(orderArr) {
  const output = {};
  return new Promise((resolve, reject) => {
    for (const ele of orderArr) {
      const orderId = ele.id;
      getOrders(orderId)
        .then(orderData => {
          output[orderId] = orderData;
          // console.log(output);
          if (Object.keys(output).length === orderArr.length) {
            // console.log('resolved');
            resolve(output);
          }
        });
    }
  });
};

// const findUpdatedOrder = function(newArr, cachedArr) {
//   let output = [];

//   if (cachedArr === undefined) {
//     output = newArr;
//   }

//   return output;
// };

//take in an array formatted as  [{id: orderId}, {id: orderId}...]
//then render all details of the order as a new order
const renderNewOrders = function(orderArr) {
  // const updatedOrders = findUpdatedOrder(orderArr, newOrdersCache);
  getOrderDetails(orderArr)
    .then((orderData) => {
      for (const ele of orderArr) {
        const orderId = ele.id;
        const { orderDetails, itemsFromOrder } = orderData[orderId];
        const $orderDiv = `
          <li id='order_id_${orderId}'>
            <h2>Order ${orderId}</h2>
            <p>@ ${orderDetails.created_at}</p>
            <p>Customer: ${orderDetails.name} (${orderDetails.phone})</p>
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
      }
    });
};

const renderPendingOrders = function(orderArr) {
  for (const ele of orderArr) {
    const orderId = ele.id;
    getOrders(orderId)
      .then(orderData => {
        const { orderDetails, itemsFromOrder } = orderData;
        const $orderDiv = `
          <li id='order_id_${orderId}'>
            <h2>Order ${orderId}</h2>
            <p>@ ${orderDetails.created_at}</p>
            <p>Customer: ${orderDetails.name} (${orderDetails.phone})</p>
            <ul></ul>
            <p>Order Total: $${orderDetails.total / 100}</p>
            <form method='POST' action='/orders/${orderId}/done'>
              <label for='done'>Message: </label>
              <input name='done' placeholder='Your order is ready!'>
              <input type='submit' value='Done'>
            </form>
          </li>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li>x${ele.quantity} ${ele.name}</li>`;
        }

        $('#pending_orders').append($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);
      });
  }
};

//get and render all active orders
const renderAllOrders = function() {
  $('ol').on('order_update_succeeded', renderAllOrders);
  getOrders()
    .then(data => {
      renderNewOrders(data.newOrders);
      renderPendingOrders(data.pendingOrders);
    });
};

//driver code
$().ready(() => {
  renderAllOrders();
});
