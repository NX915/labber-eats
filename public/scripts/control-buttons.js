const attachButtonListener = function() {
  $('ol').on('submit', (e) => {
    e.preventDefault();
    const { action, method, parentElement } = e.target;
    let order_id = parentElement.id.split('_').pop();
    // console.log(e);
    // order_id = order_id.pop();
    console.log(order_id);

    $.ajax({url: action, method: method})
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

//driver code
$().ready(() => {
  attachButtonListener();
});
