const attachButtonListener = function() {
  $('ol').on('submit', (e) => {
    e.preventDefault();
    const { action } = e.target;
    // console.log(e);
    // console.log(action);

    return $.ajax({url: action, method: 'post'})
      .then(res => console.log(res))
      .catch(err => console.log('Server connection error ', err));
  });
};

//driver code
$().ready(() => {
  attachButtonListener();
});
