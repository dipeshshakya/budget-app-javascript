// budget controller
var budgetController = (function(){

})();


// ui controller
var UIController =(function(){
	var DOMstrings ={
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue:'.add__value',
		inputBtn:'.add__btn',
	}
	 return {
		getInput: function(){
			return{
				type:document.querySelector(DOMstrings.inputType).value,
				description:document.querySelector(DOMstrings.inputDescription).value,
				value:document.querySelector(DOMstrings.inputValue).value
			};
		},
		getDOMstrings:function(){
			return DOMstrings;
		}
	};

})();




//global app controller
var controller = (function(budgetCtrl,UICtrl){
	var setupEventListeners =function(){
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
		document.addEventListener('keypress',function(event){
			if(event.keyCode === 13 || event.which ===13){
				ctrlAddItem();
			}
		});

	}


	var ctrlAddItem = function(){
		// 1. get the field input data
		var input = UICtrl.getInput();
		// 2.add item to the budget controller
		// 3.add item to the ui 
		// 4.calculate the budget
		// 5.display the budget on the ui
		console.log(input);
	}

	return {
		init:function(){
			console.log('app started');
			setupEventListeners(); 

		}
	};
	


})(budgetController,UIController);

controller.init(); 