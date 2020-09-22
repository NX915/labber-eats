const attachButtonListener = function() {
  $('ol').on('submit', (e) => {
    e.preventDefault();
    const { action, method, parentElement } = e.target;
    const userInput = {input: $(e.target).find('input.user_input').val()};
    // console.log(e);
    // let order_id = parentElement.id.split('_').pop();
    // order_id = order_id.pop();
    // console.log(userInput);

    $.ajax({url: action, method: method, data: userInput})
      .then(res => {
        console.log(res);
        $(parentElement).trigger('order_update_succeeded');
      })
      .catch(err => {
        console.log('Ajax request error ', err);
        $(parentElement).trigger('order_update_failed');
      });
  });
};

//make ajax request for all the active order id, or get order details for one order if an id is passed in
const getOrders = function(id) {
  const url = id === undefined ? '/orders' : `/orders/${id}`;

  return $.ajax({url: url, method: 'get'})
    .then(res => res)
    .catch(err => console.log('error ', err));
};

//take in array [{id: 1}, {id: 2}] and output [1, 2]
const destructOrderId = function(orderArr) {
  const output = [];

  for (const ele of orderArr) {
    output.push(ele.id);
  }
  return output;
};

//request all the order details for a given array of order id and return the data in a promise
const getOrderDetails = function(orderArr) {
  const output = {};
  return new Promise((resolve, reject) => {
    for (const orderId of orderArr) {
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

// a function to parse timestamps returned from the database
const parseTimestamp = timestamp => {
  return new Date(timestamp).toTimeString().slice(0, 8)
}

//take in an array formatted as  [{id: orderId}, {id: orderId}...]
//then render all details of the order as a new order
const renderNewOrders = function(orderArr) {

  getOrderDetails(orderArr)
    .then((orderData) => {
      for (const orderId of orderArr) {
        const { orderDetails, itemsFromOrder } = orderData[orderId];
        const $orderDiv = `
          <h2>Order# ${orderId}</h2>
          <p>@ ${parseTimestamp(orderDetails.created_at)}</p>
          <p>Customer: ${orderDetails.name} (${orderDetails.phone})</p>
          <ul></ul>
          <p>Order Total: $${orderDetails.total / 100}</p>
          <form method='POST' action='/orders/${orderId}'>
            <label for='wait-time'>Wait Time: </label>
            <input type='number' step='5' name='wait-time' class='user_input' placeholder='Default 20'>
            <input type='submit' value='Accept'>
          </form>
          <form method='POST' action='/orders/${orderId}/decline'>
            <label for='decline'>Message: </label>
            <input type='text' name='decline' class='user_input' placeholder='Sorry! We cannot take orders right now'>
            <input type='submit' value='Decline'>
          </form>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li>x${ele.quantity} ${ele.name}</li>`;
        }

        $(`#order_id_${orderId}`).html($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);
      }
    });
};

const renderPendingOrders = function(orderArr) {
  // $('#pending_orders').empty();
  getOrderDetails(orderArr)
    .then(orderData => {
      for (const orderId of orderArr) {
        const { orderDetails, itemsFromOrder } = orderData[orderId];
        const $orderDiv = `
          <h2>Order# ${orderId}</h2>
          <p>@ ${parseTimestamp(orderDetails.created_at)}</p>
          <p>Customer: ${orderDetails.name} (${orderDetails.phone})</p>
          <ul></ul>
          <p>Order Total: $${orderDetails.total / 100}</p>
          <form method='POST' action='/orders/${orderId}/done'>
            <label for='done'>Message: </label>
            <input type='text' name='done' class='user_input' placeholder='Your order is ready!'>
            <input type='submit' value='Done'>
          </form>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li>x${ele.quantity} ${ele.name}</li>`;
        }

        // $('#pending_orders').append($orderDiv);
        $(`#order_id_${orderId}`).html($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);
      }
    });
};