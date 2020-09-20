// dbHelpers.getMenu()
// .then(res => console.log('getMenu then:', res))
// .catch(e => console.log('getMenu catch:', e))

// dbHelpers.getNewOrders()
// .then(res => console.log('getNewOrders then:', res))
// .catch(e => console.log('getNewOrders catch:', e))

// dbHelpers.getPendingOrders()
// .then(res => console.log('getPendingOrders then:', res))
// .catch(e => console.log('getPendingOrders catch:', e))

// dbHelpers.getOrderDetails(1)
// .then(res => console.log('then response for order details for order 1:', res))
// .catch(e => console.log('catch response for order details for order 1:', e));

// dbHelpers.getOrderDetails(13)
// .then(res => console.log('then response for order details for order 13:', res))
// .catch(e => console.log('catch response for order details for order 13:', e));

// dbHelpers.getItemsFromOrder(1)
// .then(res => console.log('then response for items from order 1:', res))
// .catch(e => console.log('catch response for items from order 1:', e));

// dbHelpers.getItemsFromOrder(15)
// .then(res => console.log('then response for items from order 15:', res))
// .catch(e => console.log('catch response for items from order 15:', e));

// // ok --> should add to db
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'Danilo', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (should not have an error):', e));

// // ok --> should add to db
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:1 },
//   userDetails: { name: 'Sara', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log('outside dbHelpers (should not have an error):', e));

// // ok --> should return an error: it seems that not all of the selected quantities are valid
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:0 },
//   userDetails: { name: 'Selected item < 0', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log('outside dbHelpers(q < 0):', e));

// // ok --> should return an error: it seems that no item has been selected
// dbHelpers.addOrder({
//   selectedItems: {},
//   userDetails: { name: 'invalid selection', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (no item selected):', e));

// // ok --> should return an error: The name field does not contain a valid input
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: '', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (name is not a valid input):', e));

// // ok --> should return an error: The phone number is empty
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'absent phone' }
// })
// .catch(e => console.log('outside dbHelpers (no phone):', e));

// // ok --> should return an error: The phone number incomplete
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'invalid phone', phone: 123456789 }
// })
// .catch(e => console.log('outside dbHelpers (incomplete phone):', e));

// // ok --> should return an error: The phone number is invalid
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'phone as a big string', phone: 'I don\'t want to inform my phone' }
// })
// .catch(e => console.log('outside dbHelpers (string as phone):', e));

// // ok --> should return an error: The phone number is longer than expected
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'numberIsToLong', phone: '+1(234)567-8951234567895123456789512' }
// })
// .catch(e => console.log('outside dbHelpers (phone too long):', e));

// // ok --> should return an error: unavailable item
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'unavailable item', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (unavailable item):', e));

// // ok --> should return an error: non existing item
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 5:5 },
//   userDetails: { name: 'non existing item', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (non existing item):', e));


// dbHelpers.processOrder({order_id: 1}) // should be accepted
// .then(res => console.log('outside then response for processing order 1:',res))
// .catch(e => console.log('outside catch response for processing order 1:',e))
// dbHelpers.processOrder({order_id: 2, accepted: 'anything'}) // should be accepted
// .then(res => console.log('outside then response for processing order 2:',res))
// .catch(e => console.log('outside catch response for processing order 2:',e))

// dbHelpers.processOrder({order_id: 3, accepted: false}) // should be rejected
// .then(res => console.log('outside then response for processing order 3:',res))
// .catch(e => console.log('outside catch response for processing order 3:',e))

// dbHelpers.processOrder({order_id: 4, accepted: ''}) // should be accepted
// .then(res => console.log('outside then response for processing order 4:',res))
// .catch(e => console.log('outside catch response for processing order 4:',e))

// dbHelpers.processOrder({order_id: 13, accepted: ''}) // should return an error
// .then(res => console.log('outside then response for processing order 13:',res))
// .catch(e => console.log('outside catch response for processing order 13:',e))

// dbHelpers.finishOrder(6)
// .then(res => console.log('outside then response for finishing order 6:', res))
// .catch(e => console.log('outside catch response for finishing order 6:',e))

// dbHelpers.finishOrder(13)
// .then(res => console.log('outside then response for finishing order 13:', res))
// .catch(e => console.log('outside catch response for finishing order 13:',e))
