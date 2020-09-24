const attachOrderSubmitListener = function() {
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
        // console.log(res);
        $(e.target).trigger('order_update_succeeded');
      })
      .catch(err => {
        console.log('Ajax request error ', err);
        $(e.target).trigger('order_update_failed');
      });
  });
};

const renderError = function(err) {
  const errorDiv = '#control_error';

  if (err === undefined && $(errorDiv).html().length > 0) {
    $(errorDiv).slideUp(200, () => {
      $(errorDiv).addClass('hidden');
      $(errorDiv).html('');
    });
  } else if (err) {
    $(errorDiv).slideUp(200, () => {
      $(errorDiv).removeClass('hidden');
      $(errorDiv).html(`${err.message}`);
      $(errorDiv).slideDown(200);
    });
  }
};

//make ajax request for all the active order id, or get order details for one order if an id is passed in
const getOrders = function(id) {
  const url = id === undefined ? '/orders' : `/orders/${id}`;

  return $.ajax({url: url, method: 'get'})
    .then(res => {
      renderError();
      return res;
    })
    .catch(err => {
      err.message = 'Cannot connect to server';
      renderError(err);
    });
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
          <div class='order_header'>
            <h2># ${orderId}</h2>
            <p>@ ${parseTimestamp(orderDetails.created_at)}</p>
          </div>
          <p>Contact: ${orderDetails.name} (${orderDetails.phone})</p>
          <ul></ul>
          <p>Total: $${orderDetails.total / 100}</p>
          ${orderDetails.comment !== null ? '<p>Customer Note: ' + escape(orderDetails.comment) + '</p>' : ''}
          <form class='accept-form' method='POST' action='/orders/${orderId}'>
            <div class='new_order_button_container'>
              <input type='number' class='user_input hidden' required>
              <input type='submit' value='Accept (${orderDetails.estimated_wait}mins)'>
              <button type='button' class='options-toggle'>Options</button>
            </div>
          </form>
          <form class='accept-form hidden' method='POST' action='/orders/${orderId}'>
            <label for='wait-time'>Wait Time</label>
            <input type='number' step='1' name='wait-time' class='user_input' placeholder='${orderDetails.estimated_wait}' required>
            <input type='submit' value='Accept'>
          </form>
          <form class='done-form hidden' method='POST' action='/orders/${orderId}/done'>
            <label for='done'><div>Message <output></output></div></label>
            <input type='text' maxlength='150' name='done' class='user_input' placeholder='Your order is ready!'>
            <input type='submit' value='Ready'>
          </form>
          <form class='decline-form hidden' method='POST' action='/orders/${orderId}/decline'>
            <label for='decline'>Message <output></output> </label>
            <input type='text' maxlength='150' name='decline' class='user_input' placeholder='Sorry! We cannot take orders right now'>
            <input type='submit' value='Decline'>
          </form>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li title='${ele.acronym}'>x${ele.quantity} ${ele.name}</li>`;
        }

        $(`#order_id_${orderId}`).html($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);

        $(`#order_id_${orderId} [type="number"]`).val(orderDetails.estimated_wait);

        $(`#order_id_${orderId} .options-toggle`).on('click', () => {
          $(`#order_id_${orderId} form`).toggleClass('hidden');
        });
      }
    });
};

const renderPendingOrders = function(orderArr) {
  // $('#pending_orders').empty();
  getOrderDetails(orderArr)
    .then(orderData => {
      // console.log(orderData)
      for (const orderId of orderArr) {
        const { orderDetails, itemsFromOrder } = orderData[orderId];
        const $orderDiv = `
          <div class='order_header'>
            <h2># ${orderId}</h2>
            <div>
              <p>@ ${parseTimestamp(orderDetails.created_at)}</p>
              <p>Informed Wait: ${orderDetails.informed_time} min</p>
            </div>
          </div>
          <p>Contact: ${orderDetails.name} (${orderDetails.phone})</p>
          <ul></ul>
          <p>Total: $${orderDetails.total / 100}</p>
          <p>${orderDetails.comment !== null ? 'Customer Note: ' + escape(orderDetails.comment) : ''}</p>
          <form class='done-form' method='POST' action='/orders/${orderId}/done'>
            <label for='done'><div>Message <output></output></div></label>
            <input type='text' maxlength='150' name='done' class='user_input' placeholder='Your order is ready!'>
            <input type='submit' value='Ready'>
          </form>
        `;
        let $itemsDiv = '';

        for (const ele of itemsFromOrder) {
          $itemsDiv += `<li title='${ele.acronym}'>x${ele.quantity} ${ele.name}</li>`;
        }

        // $('#pending_orders').append($orderDiv);
        $(`#order_id_${orderId}`).html($orderDiv);
        $(`#order_id_${orderId} ul`).append($itemsDiv);
      }
    });
};

const renderOrderCounts = function(orderIDObj) {
  const { newOrders, pendingOrders } = orderIDObj;
  $('#new_order_header').html(`New Orders (${newOrders.length})`);
  $('#pending_order_header').html(`In Progress (${pendingOrders.length})`);
};

