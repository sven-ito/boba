// ------------------------------------------------------------------------------

// All relevant GUI components
const TEXT_AREA = document.getElementById('prioItems');
const ITEM_LIST_FORM = document.getElementById('addForm');
const CHOICES_FORM = document.getElementById('collectForm');
const ITEM_LIST = document.getElementById('items');
const CHOICES_LIST = document.getElementById('choicesList');
const EVAL_LIST = document.getElementById('evaluationList');
const EVAL_BUTTON = document.getElementById('evaluationButton');

// All data structures for (processed) inputs - as global variables
var items = [];
var choices = [];
var scoring = [];

// Add event handlers
ITEM_LIST_FORM.addEventListener('submit', addItems);
CHOICES_FORM.addEventListener('submit', createChoices);
EVAL_BUTTON.addEventListener('click', evaluatePrios);


// ------------------------------------------------------------------------------

//Add item
function addItem(newItem) {

    // Get input value
    //var newItem = document.getElementById('item').value;

    // Create new li element
    let li = document.createElement('li');
    // Add class
    li.className = 'list-group-item';
    // Add text node with input value
    li.appendChild(document.createTextNode(newItem));

    // Append li to list
    ITEM_LIST.appendChild(li);
}

function addItems(e) {

    e.preventDefault();

    let lines = TEXT_AREA.value.split("\n");

    for (let i = 0; i < lines.length; i++) {
        addItem(lines[i]);
    }

}

function createChoices(e) {

    e.preventDefault();

    // Collect list items into an array / list
    for (let i = 0; i < ITEM_LIST.children.length; i++) {
        items[i] = ITEM_LIST.children[i].innerText;
    }
    console.log(items);

    for (let i = 0; i < items.length; i++) {
        scoring[i] = 0;
    }
    console.log(scoring);

    //Create combinations
    for (let i = 0; i < items.length - 1; i++) {

        console.log(items[i]);

        let currentSubList = items.slice(i + 1, items.length)

        console.log(currentSubList);
        for (let j = 0; j < currentSubList.length; j++) {

            //console.log([items[i], currentSubList[j]]);
            //choices.push([items[i], currentSubList[j]]);

            console.log([i, i + 1 + j]);
            choices.push([i, i + 1 + j]);
        }
    }

    console.log(choices);

    for (let i = 0; i < choices.length; i++) {

        // Create new li element
        let li = document.createElement('li');
        li.className = 'list-group-item';

        let div = document.createElement('div');
        div.className = 'row';

        let indexOptionA = choices[i][0];
        console.log(choices[i][0]);

        let div2 = document.createElement('div');
        div2.className = 'col-sm';
        let button2 = document.createElement('button');
        button2.className = 'btn btn-primary';
        button2.appendChild(document.createTextNode(items[indexOptionA]));
        button2.dataset.indexOption = indexOptionA;
        button2.addEventListener(
            'click',
            function () {
                console.log("Option A: " + this.dataset.indexOption);
                scoring[this.dataset.indexOption]++;

                let allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
                    allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';
            },
            false
        );
        div2.appendChild(button2);
        div.appendChild(div2);

        let indexOptionB = choices[i][1];
        console.log(choices[i][1]);

        let div3 = document.createElement('div');
        div3.className = 'col-sm';
        let button3 = document.createElement('button');
        button3.className = 'btn btn-info';
        button3.appendChild(document.createTextNode(items[indexOptionB]));
        button3.dataset.indexOption = indexOptionB;
        button3.addEventListener(
            'click',
            function () {
                console.log("Option B: " + this.dataset.indexOption);
                scoring[this.dataset.indexOption]++;

                let allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
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
        CHOICES_LIST.appendChild(li);

    }
}

// from https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi

function sortWithIndeces(toSort) {
    for (let i = 0; i < toSort.length; i++) {
        toSort[i] = [toSort[i], i];
    }
    toSort.sort(function (left, right) {
        // Modified: '<' --> '>' for reverse order
        return left[0] > right[0] ? -1 : 1;
    });
    toSort.sortIndices = [];
    for (let j = 0; j < toSort.length; j++) {
        toSort.sortIndices.push(toSort[j][1]);
        toSort[j] = toSort[j][0];
    }
    return toSort;
}

function evaluatePrios(e) {

    console.log(scoring);
    sortWithIndeces(scoring);

    for (let i = 0; i < scoring.length; i++) {

        // Create new li element
        let li = document.createElement('li');
        li.className = 'list-group-item';

        li.appendChild(document.createTextNode(items[scoring.sortIndices[i]] + " : " + scoring[i]));
        EVAL_LIST.appendChild(li);

    }


}



