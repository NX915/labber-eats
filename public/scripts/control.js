let orderIDCache = {};

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

const addOrders = function(addedOrders, newOrders, parentDivID) {

  for (const orderID of addedOrders) {
    let appendToID;

    appendToID = newOrders[newOrders.indexOf(orderID) - 1];
    if (appendToID === undefined) {
      $(parentDivID).prepend(`<li id='order_id_${orderID}'></li>`);
    } else {
      $(`#order_id_${appendToID}`).after(`<li id='order_id_${orderID}'></li>`);
    }
  }
};

//get and render all active orders
const renderAllOrders = function() {
  getOrders()
    .then(data => {

      const orderID = {
        newOrders: destructOrderId(data.newOrders),
        pendingOrders: destructOrderId(data.pendingOrders)
      };

      if (orderIDCache.newOrders && orderIDCache.pendingOrders) {
        const removedOrders = getRemovedOrders(orderID.newOrders, orderIDCache.newOrders);
        removedOrders.push(getRemovedOrders(orderID.pendingOrders, orderIDCache.pendingOrders));
        const addedNewOrders = getAddedOrders(orderID.newOrders, orderIDCache.newOrders);
        const addedPendingOrders = getAddedOrders(orderID.pendingOrders, orderIDCache.pendingOrders);

        console.log('update orders ');
        console.log('new orders ', orderID.newOrders);
        console.log('pending orders ', orderID.pendingOrders);
        console.log('cached new orders ', orderIDCache.newOrders);
        console.log('removed new orders ', removedOrders);
        console.log('added new orders ', addedNewOrders);
        console.log('added pending orders ', addedPendingOrders);

        removeOrders(removedOrders);
        addOrders(addedNewOrders, orderID.newOrders, '#new_orders');
        addOrders(addedPendingOrders, orderID.pendingOrders, '#pending_orders');
        renderNewOrders(addedNewOrders);
        renderPendingOrders(addedPendingOrders);

      } else {
        console.log('all new orders ', orderID);
        addOrders(orderID.newOrders, orderID.newOrders, '#new_orders');
        addOrders(orderID.pendingOrders, orderID.pendingOrders, '#pending_orders');
        renderNewOrders(orderID.newOrders);
        renderPendingOrders(orderID.pendingOrders);
      }
      orderIDCache.newOrders = orderID.newOrders;
      orderIDCache.pendingOrders = orderID.pendingOrders;
    });
};

//driver code
$().ready(() => {
  renderAllOrders();
  attachButtonListener();
  $('ol').on('order_update_succeeded', renderAllOrders);
  window.setInterval(renderAllOrders, 5000);
});
