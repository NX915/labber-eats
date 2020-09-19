const renderNewOrders = function() {
  console.log('It works!');
  $.ajax({url: '/orders', method: 'get'})
    .then(res => console.log(res))
    .catch(err => console.log('error ', err));
};

$().ready(() => {
  renderNewOrders();
});


// $.ajax({ url: '/tweets/', data, method: "POST" }).then(() => {
//   // after updating the database, request /tweets/, empty the tweets-container and render the new tweets
//   $.ajax({ url: '/tweets/', method: "GET" }).then(response => {
//     $("#tweets-container").empty();
//     renderTweets(response);
//   });
// });
