let orderIDCache = {};
// let orderDataCache;
// let newOrdersCache;
// let pendingOrdersCache;

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

// const findUpdatedOrder = function(newArr) {
//   let output = {new: [], gone: []};
//   console.log('new ', newArr);
//   console.log('cache ', newOrdersCache);

//   if (newOrdersCache === undefined) {
//     output.new = newArr;
//     output.gone = [];
//     newOrdersCache = newArr;
//   } else {
//     for (const orderId of newOrdersCache) {
//       if (newArr.indexOf(orderId) === -1) {
//         console.log('gone ', orderId);
//         output.gone.push(orderId);
//       }
//     }
//     for (const orderId of newArr) {
//       if (newOrdersCache.indexOf(orderId) === -1) {
//         console.log('new ', orderId);
//         output.new.push(orderId);
//       }
//     }
//   }

//   return output;
// };

//take in an array formatted as  [{id: orderId}, {id: orderId}...]
//then render all details of the order as a new order
const renderNewOrders = function(orderArr) {
  // const updatedOrders = findUpdatedOrder(orderArr);
  // console.log(updatedOrders);

  // $('#new_orders').empty();
  getOrderDetails(orderArr)
    .then((orderData) => {
      for (const orderId of orderArr) {
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
              <input type='number' step='5' name='wait-time' class='user_input' placeholder='Default 20'>
              <input type='submit' value='Accept'>
            </form>
            <form method='POST' action='/orders/${orderId}/decline'>
              <label for='decline'>Message: </label>
              <input type='text' name='decline' class='user_input' placeholder='Sorry! We cannot take orders right now'>
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
  // $('#pending_orders').empty();
  getOrderDetails(orderArr)
    .then(orderData => {
      for (const orderId of orderArr) {
        const { orderDetails, itemsFromOrder } = orderData[orderId];
        const $orderDiv = `
          <li id='order_id_${orderId}'>
            <h2>Order ${orderId}</h2>
            <p>@ ${orderDetails.created_at}</p>
            <p>Customer: ${orderDetails.name} (${orderDetails.phone})</p>
            <ul></ul>
            <p>Order Total: $${orderDetails.total / 100}</p>
            <form method='POST' action='/orders/${orderId}/done'>
              <label for='done'>Message: </label>
              <input type='text' name='done' class='user_input' placeholder='Your order is ready!'>
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
      }
    });
};

//return array elements that is missing from new array compared to old array
const getRemovedOrders = function(newArr, oldArr) {
  const output = [];

  for (const ele of oldArr) {
    if (newArr.indexOf(ele) === -1) {
      output.push(ele);
    }
  }

  return output;
};

//return array elements that is in new array compared to old array
const getAddedOrders = function(newArr, oldArr) {
  const output = [];

  for (const ele of newArr) {
    if (oldArr.indexOf(ele) === -1) {
      output.push(ele);
    }
  }

  return output;
};

const removeOrders = function(orderIDArr) {
  for (const orderID of orderIDArr) {
    $(`#order_id_${orderID}`).remove();
  }
};

const addOrders = function(addedOrders, n) {
  //add [5, 6]
  //cache [1, 2, 3, 4, 7]
  //after remove [1, 2, 4]
  //new [1, 2, 5, 4, 6]

};

//get and render all active orders
const renderAllOrders = function() {
  getOrders()
    .then(data => {
      // $('ol').empty();
      // console.log('new', destructOrderId(data.newOrders));
      // renderNewOrders(destructOrderId(data.newOrders));
      // renderPendingOrders(destructOrderId(data.pendingOrders));

      const orderID = {
        newOrders: destructOrderId(data.newOrders),
        pendingOrders: destructOrderId(data.pendingOrders)
      };

      if (orderIDCache.newOrders && orderIDCache.pendingOrders) {
        console.log('update orders ');
        console.log('new order ', orderID.newOrders);
        console.log('cached new order ', orderIDCache.newOrders);
        console.log('removed new orders ', getMissingOrders(orderID.newOrders, orderIDCache.newOrders));
        console.log('added new orders ', getNewOrders(orderID.newOrders, orderIDCache.newOrders));

        const removedOrders = getRemovedOrders(orderID.newOrders, orderIDCache.newOrders);
        const addedOrders = getAddedOrders(orderID.newOrders, orderIDCache.newOrders);

        removeOrders(removedOrders);
        addOrders(addedOrders);

      } else {
        console.log('all new orders ', orderID);
        $('ol').empty();
        renderNewOrders(destructOrderId(data.newOrders));
        renderPendingOrders(destructOrderId(data.pendingOrders));
      }
      orderIDCache.newOrders = orderID.newOrders;
      orderIDCache.pendingOrders = orderID.pendingOrders;
    });
};

//driver code
$().ready(() => {
  renderAllOrders();
  $('ol').on('order_update_succeeded', renderAllOrders);
});
