var form = document.getElementById('addForm');
var form2 = document.getElementById('collectForm');
var itemList = document.getElementById('items');
var choicesList = document.getElementById('choicesList');
var evaluationList = document.getElementById('evaluationList');

var textArea = document.getElementById('prioItems');

var evaluationButton = document.getElementById('evaluationButton');

var items = [];
var choices = [];
var scoring = [];

// Form submit event
form.addEventListener('submit', addItems);
form2.addEventListener('submit', createChoices);
evaluationButton.addEventListener('click', evaluatePrios);


//Add item
function addItem(newItem) {

  // Get input value
  //var newItem = document.getElementById('item').value;

  // Create new li element
  var li = document.createElement('li');
  // Add class
  li.className = 'list-group-item';
  // Add text node with input value
  li.appendChild(document.createTextNode(newItem));

  // Append li to list
  itemList.appendChild(li);
}

function addItems(e) {

    e.preventDefault();

    var lines = textArea.value.split("\n");

    for (var i = 0; i < lines.length; i++) {
        addItem(lines[i]);
    }

}

function createChoices(e) {

    e.preventDefault();

    // Collect list items into an array / list
    for (var i = 0; i < itemList.children.length; i++) {
        items[i] = itemList.children[i].innerText;
    }
    console.log(items);

    for (var i = 0; i < items.length; i++) {
        scoring[i] = 0;
    }
    console.log(scoring);

    //Create combinations
    for (var i = 0; i < items.length-1; i++) {

        console.log(items[i]);

        var currentSubList = items.slice(i+1,items.length)
        
        console.log(currentSubList);
        for (var j = 0; j < currentSubList.length; j++) {
            
            //console.log([items[i], currentSubList[j]]);
            //choices.push([items[i], currentSubList[j]]);
            
            console.log([i, i+1+j]);
            choices.push([i, i+1+j]);
        }
    }

    console.log(choices);

    for (var i = 0; i < choices.length; i++) {

        // Create new li element
        var li = document.createElement('li');
        li.className = 'list-group-item';

        var div = document.createElement('div');
        div.className = 'row';
       
        var indexOptionA = choices[i][0];
        console.log(choices[i][0]);

        var div2 = document.createElement('div');
        div2.className = 'col-sm';
        var button2 = document.createElement('button');
        button2.className = 'btn btn-primary';
        button2.appendChild(document.createTextNode(items[indexOptionA]));
        button2.dataset.indexOption = indexOptionA;
        button2.addEventListener(
            'click', 
            function() {
                console.log("Option A: "+this.dataset.indexOption);
                scoring[this.dataset.indexOption]++;

                var allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (var i = 0; i < allButtons.length; i++) {
                    allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';
        },
        false
        );
        div2.appendChild(button2);
        div.appendChild(div2);

        var indexOptionB = choices[i][1];
        console.log(choices[i][1]);

        var div3 = document.createElement('div');
        div3.className = 'col-sm';
        var button3 = document.createElement('button');
        button3.className = 'btn btn-info';
        button3.appendChild(document.createTextNode(items[indexOptionB]));
        button3.dataset.indexOption = indexOptionB;
        button3.addEventListener(
            'click', 
            function() {
                console.log("Option B: "+this.dataset.indexOption);
                scoring[this.dataset.indexOption]++;

                var allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (var i = 0; i < allButtons.length; i++) {
                    allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';
        },
        false
        );
        div3.appendChild(button3);
        div.appendChild(div3);

        li.appendChild(div);

        //li.appendChild(document.createTextNode(items[choices[i][0]]+" vs "+items[choices[i][1]]));
        // Append li to list
        choicesList.appendChild(li);

    }
}

// from https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi

function sortWithIndeces(toSort) {
    for (var i = 0; i < toSort.length; i++) {
      toSort[i] = [toSort[i], i];
    }
    toSort.sort(function(left, right) {
        // Modified: '<' --> '>' for reverse order
      return left[0] > right[0] ? -1 : 1;
    });
    toSort.sortIndices = [];
    for (var j = 0; j < toSort.length; j++) {
      toSort.sortIndices.push(toSort[j][1]);
      toSort[j] = toSort[j][0];
    }
    return toSort;
  }

function evaluatePrios(e) {

    console.log(scoring);
    sortWithIndeces(scoring);

    for (var i = 0; i < scoring.length; i++) {

        // Create new li element
        var li = document.createElement('li');
        li.className = 'list-group-item';

        li.appendChild(document.createTextNode(items[scoring.sortIndices[i]]+" : "+scoring[i]));
        evaluationList.appendChild(li);

    }

    
}



