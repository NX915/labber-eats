const getOrders = function() {
  console.log('It works!');
  return $.ajax({url: '/orders', method: 'get'})
    .then(res => res)
    .catch(err => console.log('error ', err));
};

$().ready(() => {
  getOrders()
    .then(res => console.log(res));
});


// $.ajax({ url: '/tweets/', data, method: "POST" }).then(() => {
//   // after updating the database, request /tweets/, empty the tweets-container and render the new tweets
//   $.ajax({ url: '/tweets/', method: "GET" }).then(response => {
//     $("#tweets-container").empty();
//     renderTweets(response);
//   });
// });
