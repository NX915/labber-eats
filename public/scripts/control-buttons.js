const attachButtonListener = function() {
  $('ol').on('submit', (e) => {
    e.preventDefault();
    const { action, method, parentElement } = e.target;
    const userInput = $(e.target).find('input.user_input').val();
    let order_id = parentElement.id.split('_').pop();

    console.log(e);
    // order_id = order_id.pop();
    console.log(userInput);

    $.ajax({url: action, method: method, data: JSON.stringify(userInput)})
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
