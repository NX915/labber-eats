const attachButtonListener = function() {
  $('ol').on('submit', (e) => {
    e.preventDefault();
    const { action, method } = e.target;

    $.ajax({url: action, method: method})
      .then(function(res) {
        console.log(res);
      })
      .catch(function(err) {
        console.log('Ajax request error ', err);
      });
  });
};

//driver code
$().ready(() => {
  attachButtonListener();
});
