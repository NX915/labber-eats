/* eslint-disable no-unused-vars */
const changeCharCounter = (el, max, textLength) => el.text(max - textLength);

// counter that add and remove class to a counter element if user input goes over 140 characters
const charCounter = function(ele) {
  const textInput = $(ele).val();
  const counter = $(ele).parent().find("output");
  const limit = 150;
  const count = limit - textInput.length;

  if (count < 0) {
    $(counter).addClass("over-limit");
  } else {
    $(counter).removeClass("over-limit");
  }
  if (count === 150) {
    counter.html('');
  } else {
    counter.html(count);
  }
};

//escape string to prevent CSX attack
const escape =  function(str) {
  let div = document.createElement('div');

  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};
