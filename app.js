// budget controller
var budgetController = (function(){
	// private function constructor
	var Expense = function(id,description,value){
		this.id =id;
		this.description= description;
		this.value=value;
	};

	var Income = function(id,description,value){
		this.id =id;
		this.description= description;
		this.value=value;
	}; 

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
	};
	// data obj
	var data = {
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0
		},
		budget:0,
		percentage:-1
		
	}

	return{
		addItem:function(type,des,val){
			var newItem ,ID;
			// create new ID
			if (data.allItems[type].length > 0) {
			ID = data.allItems[type][data.allItems[type].length-1].id+1;
			}
			else{
				ID =0;
			}
			
			// create new item based on 'inc'or 'exp'
			if(type ==='exp'){
				newItem = new Expense(ID,des ,val)
			}else if(type ==='inc'){
				newItem = new Income(ID,des ,val)
			}
				
				// push it into a data structure
			data.allItems[type].push(newItem);

			// return the new elements
			return newItem;	
			},
		deleteItem:function(type,id){
			var ids,index;
			// id = 3
			// data.allitems[type][id]
			
			// 6 will be deleted
			ids = data.allItems[type].map(function(current){
				// map return brand new array
				return current.id;
				// ids = [1,2,4,6,3]
			});
			index = ids.indexOf(id);
			// 
			if(index !== -1){
				data.allItems[type].splice(index,1);			}

		},	
		
		testing:function(){
			console.log(data);
		},
		calculateBudget:function(){
			// calc total income and expense
			calculateTotal('exp');
			calculateTotal('inc');
			// calc budget :income-expense
			data.budget = data.totals.inc-data.totals.exp;
			// calc the percentage of the  income that we spent
			if (data.totals.inc > 0) {
				data.percentage =Math.round((data.totals.exp/data.totals.inc)*100);
			}else{
				data.percentage = -1;
			}
			
		},
		getBudget:function(){
			return{
				budget:data.budget,
				totalInc:data.totals.inc,
				totalExp:data.totals.exp,
				percentage:data.percentage

			}
		},
	};

})();


// ui controller
var UIController =(function(){
	var DOMstrings ={
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue:'.add__value',
		inputBtn:'.add__btn',
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		budgetLabel:'.budget__value',
		incomeLabel:'.budget__income--value',
		expenseLabel:'.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container:'.container',
	}
	 return {
		getInput: function(){
			return{
				type:document.querySelector(DOMstrings.inputType).value,
				description:document.querySelector(DOMstrings.inputDescription).value,
				value:parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem:function(obj,type){
			var html;
			// create html strings with placeholder text
			if (type === 'inc') {
			element = DOMstrings.incomeContainer;
			html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(type === 'exp'){
			element = DOMstrings.expenseContainer;	
			html =' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// replace the placeholder text with some actual data
			
			newhtml = html.replace('%id%',obj.id);
			newhtml = newhtml.replace('%description%',obj.description);
			newhtml = newhtml.replace('%value%',obj.value);
			
			// insert html into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

		},
		deleteListItem:function(selectorID){
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		getDOMstrings:function(){
			return DOMstrings;
		},
		clearfields:function(){
			var fields,fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ','+DOMstrings.inputValue);
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current,index,array){
				current.value = "";
			});
			fieldsArr[0].focus();
		},
		displayBudget:function(obj){
			// console.log(obj.budget);
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
			

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
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
			// delegation 
			document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
		});

	}
	var updateBudget =function(){
		// 1.calculate the budget
		budgetCtrl.calculateBudget();

		// return the budget
		var budget = budgetCtrl.getBudget();
		// console.log(budget);
		// 2.display the budget on the ui
		UICtrl.displayBudget(budget);

	};

	var ctrlAddItem = function(){
		var input,newItem;
		// 1. get the field input data
		input = UICtrl.getInput();
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

			// 2.add item to the budget controller
			newItem =budgetCtrl.addItem(input.type,input.description,input.value);
			// 3.add item to the ui 
			UICtrl.addListItem(newItem,input.type);
			// 4.clear fields
			UICtrl.clearfields();
			// 5.calculate and update budget
			updateBudget();

		}
		
		
	}

	var ctrlDeleteItem = function(event){
		var itemID,splitID,type,ID;
		itemID = event.target.parentNode.parentNode.parentNode.id;
		 
		if (itemID ) {
			splitID =itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			// 1.delete item from the datastructure
			budgetCtrl.deleteItem(type,ID);
			// 2.delete item from the ui
			UICtrl.deleteListItem(itemID);
			// 3.update and show the budget
			updateBudget();
		}

	};

	return {
		init:function(){
			console.log('app started');
			UICtrl.displayBudget({
				budget:0,
				totalInc:0,
				totalExp:0,
				percentage:0

			});
			setupEventListeners(); 

		}
	};
	


})(budgetController,UIController);

controller.init(); 