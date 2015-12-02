var right = document.getElementById('right_content');
var practice = document.getElementById('practice_div');
var left = document.getElementById('left_content');
var middle = document.getElementById('middle_content');
var flipped = false;

var content = [left, middle, right];

flip_button = function(){
	if(!flipped){
		document.getElementById('flipper').style.transform = "rotateY(180deg)";
		document.getElementById('flipper').style.webkitTransform = "rotateY(180deg)";
		flipped = true;
	} else {
		document.getElementById('flipper').style.transform = "rotateY(0deg)";
		document.getElementById('flipper').style.webkitTransform = "rotateY(0deg)";
		flipped = false;
	}
};

document.addEventListener('keydown', function(event) {
	var activeElement;
	if (event.keyCode == 9) {
		activeElement = document.activeElement;
		if (activeElement.name == "edit_input") {
			if (activeElement.nextElementSibling == null
				&& activeElement.parentElement.nextElementSibling == null
				&& activeElement.parentElement.parentElement.nextElementSibling == null) {
				event.preventDefault();
				// Add row
				addRow();
				// Focus on next element
				window.setTimeout(function() {
					activeElement.parentElement.parentElement.nextElementSibling.firstElementChild.firstElementChild.focus();
				}, 100);
			}
		}
	}
}, false);

document.getElementById('close_button').onclick = function(){
	showResults();
	document.getElementById('results').style.display = 'none';
	showList();
}

function selectList(element) {
	element.parentElement.style.background = element.checked ? '#85D4E0' : 'transparent';
	checkIfSelected();
}

function checkIfSelected() {
	var lists = document.getElementsByClassName('list_list-item');

	for(var i = 0, x = lists.length; i < x; i++) {
		list = lists[i];
		if (list.firstElementChild.firstElementChild.checked == true) {
			document.getElementById('practice_all').style.display = 'block';
			return;
		}
	}

	document.getElementById('practice_all').style.display = 'none';
}

function setResult(total, wrong){
	var correct = document.getElementById('correct_bar');
	var incorrect = document.getElementById('incorrect_bar');
	if (!wrong){
		document.getElementById('practice_incorrect').style.display = 'none'
		document.getElementById('incorrect_words_paragraph').style.display = 'none'
		incorrect.style.display = 'none';
		correct.style.width = Math.round(100 - (wrong/total * 100)) + '%';
		correct.innerHTML = Math.round((100 - (wrong/total * 100))) + '%';
	}

	else {
		incorrect.style.display = 'inline-block';
		document.getElementById('practice_incorrect').style.display = 'block'
		document.getElementById('incorrect_words_paragraph').style.display = 'block'
		incorrect.style.width = Math.round((wrong/total * 100) - 1) + '%';
		incorrect.innerHTML = Math.round((wrong/total * 100)) + '%';
		correct.style.width = Math.round(100 - (wrong/total * 100) - 1) + '%';
		correct.innerHTML = Math.round((100 - (wrong/total * 100))) + '%';
	}
}

function showEditor() {
	right.style.display = 'inline-block';
	document.getElementById('edit_list').style.display = 'block';
	document.getElementById('results').style.display = 'none';
	document.getElementById('list_items').style.display = 'none';
}

function addRow() {
	var main_controller = document.getElementById('main_controller');
	var scope = angular.element(main_controller).scope();
	var size = scope.sizeOf(scope.editData.words);

	scope.editData.words[size] = {
		language_1_text: "",
		language_2_text: ""
	};
}

function showResults() {
	var top = 4;

	function slideDown(){
		if (top == 100){
			practice.style.display = 'none';
			return true;
		}

		practice.style.top = top + '%';
		top += 2;
		requestAnimationFrame(slideDown);
	}

	slideDown();

	document.getElementById('correct').innerHTML = 0;
	document.getElementById('incorrect').innerHTML = 0;

	document.getElementById('overlay').style.display = 'none';

	for (item of content){
		item.style.display = 'inline-block';
	}

	document.getElementById('list_items').style.display = 'none';
	document.getElementById('results').style.display = 'block';
}


function showPractice() {
	practice.style.display = 'block';
	document.getElementById('overlay').style.display = 'block';
	var top = 100;

	function slideUp(){
		if (top == 4){
			return true;
		}

		practice.style.top = top + '%';
		top -= 2;
		requestAnimationFrame(slideUp);
	}

	slideUp();
}

function showList() {
	right.style.display = 'inline-block';
	fadeIn(right);
	document.getElementById('edit_list').style.display = 'none';
	document.getElementById('results').style.display = 'none';
	document.getElementById('list_items').style.display = 'block';
}

function fadeIn(el) {
  el.style.opacity = 0;

  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / 1000;
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 1000)
    }
  };

  tick();
}
