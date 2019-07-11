// ------------------------------------------------------------------------------

class Choice {

    constructor() {
        this.pickedOption = -1;
        this.comment = "";
    }

    getComment() {
        return this.comment;
    }

    setComment(comment) {

        if (typeof comment === "string")
            this.comment = comment;
    }

    getPickedOption() {
        return this.pickedOption;
    }

    setPickedOption(pickedOption) {

        if (typeof pickedOption === "number")
            this.pickedOption = pickedOption;
    }

}

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

/**
 * Adds a new item to the item list.
 * @param  {} newItem
 */
function addItem(newItem) {

    let li = document.createElement('li');
    li.className = 'list-group-item';
    li.appendChild(document.createTextNode(newItem));

    ITEM_LIST.appendChild(li);
}

/**
 * Parses the lines in the text area into single items.
 * @param  {} e
 */
function addItems(e) {

    // Hack to circumvent form default behavior (redirecting to another page)
    e.preventDefault();

    // Assumption: Lines / items are separated with new line character
    let lines = TEXT_AREA.value.split("\n");

    for (let line of lines) {
        addItem(line);
    }

}

/**
 * Creates and renders all the choices to pick for the prioritization process.
 * @param  {} e
 */
function createChoices(e) {

    // Hack to circumvent form default behavior (redirecting to another page)
    e.preventDefault();

    // Collect list items into an array / list
    for (let i = 0; i < ITEM_LIST.children.length; i++) {
        items[i] = ITEM_LIST.children[i].innerText;
    }

    console.log("Recognized items are:");
    console.log(items);

    for (let i = 0; i < items.length; i++) {
        scoring[i] = 0;
    }

    console.log("Scoring array set to 0:");
    console.log(scoring);

    //Create combinations
    for (let i = 0; i < items.length - 1; i++) {

        console.log("Combining item ... " + items[i]);

        let currentSubList = items.slice(i + 1, items.length)

        console.log("... with:");
        console.log(currentSubList);
        for (let j = 0; j < currentSubList.length; j++) {

            console.log("Resulting combination (indices):");
            console.log([i, i + 1 + j]);
            //choices.push([i, i + 1 + j]);

            // Replaced by associative array with key = indices, e.g. "1-2" means item 1 vs. 2
            let key = i+"-"+(i+1+j)
            choices[key] = new Choice();
        }
    }

    console.log("All resulting choice combinations:");
    console.log(choices);

    for (let key in choices) {

        // Parse option item indices from key
        let options = key.split('-');

        // Create new li element
        let li = document.createElement('li');
        li.className = 'list-group-item';

        let div = document.createElement('div');
        div.className = 'row';
        div.id = 'choice_'+key;

        let indexOptionA = options[0];
        console.log("Option A:");
        console.log(options[0]);

        let divOptionA = document.createElement('div');
        divOptionA.className = 'col-sm';
        let buttonOptionA = document.createElement('button');
        buttonOptionA.className = 'btn btn-dark';
        buttonOptionA.appendChild(document.createTextNode(items[indexOptionA]));
        buttonOptionA.dataset.indexOption = indexOptionA;
        buttonOptionA.addEventListener(
            'click',
            function () {
                //console.log("Option A: " + this.dataset.indexOption);
                //scoring[this.dataset.indexOption]++;

                let key = this.parentElement.parentElement.id.split('_')[1];
                choices[key].setPickedOption(0);

                let allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
                    //allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';
            },
            false
        );
        divOptionA.appendChild(buttonOptionA);
        div.appendChild(divOptionA);

        let indexOptionB = options[1];
        console.log("Option B:");
        console.log(options[1]);

        let divOptionB = document.createElement('div');
        divOptionB.className = 'col-sm';
        let buttonOptionB = document.createElement('button');
        buttonOptionB.className = 'btn btn-dark';
        buttonOptionB.appendChild(document.createTextNode(items[indexOptionB]));
        buttonOptionB.dataset.indexOption = indexOptionB;
        buttonOptionB.addEventListener(
            'click',
            function () {
                //console.log("Option B: " + this.dataset.indexOption);
                //scoring[this.dataset.indexOption]++;

                let key = this.parentElement.parentElement.id.split('_')[1];
                choices[key].setPickedOption(1);

                let allButtons = this.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
                    //allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';
            },
            false
        );
        divOptionB.appendChild(buttonOptionB);
        div.appendChild(divOptionB);

        // Comment Box:

        let divOptionComment = document.createElement('div');
        divOptionComment.className = 'col-sm';
        let optionComment = document.createElement('input');
        optionComment.type = 'text';
        optionComment.addEventListener(
            'blur',
            function () {
                
                let key = this.parentElement.parentElement.id.split('_')[1];
                choices[key].setComment(this.value);

            },
            false
        );
        divOptionComment.appendChild(optionComment);

        div.appendChild(divOptionComment);

        li.appendChild(div);

        //li.appendChild(document.createTextNode(items[choices[i][0]]+" vs "+items[choices[i][1]]));
        // Append li to list
        CHOICES_LIST.appendChild(li);

    }
}

/**
 * Sorts an array and additionally returns the indices relative to the original sort order.
 * Modified to reverse sort.
 * from https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
 * @param  {} toSort
 */
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

/**
 * Evaluates the choices return a newly prioritized item list
 * @param  {} e
 */
function evaluatePrios(e) {

    // Prepare / fill scoring array

    for(key in choices) {

        let indexPickedOption = choices[key].getPickedOption();
        let actualItemIndex = key.split('-')[indexPickedOption];
        scoring[actualItemIndex]++;
    }

    console.log("Scoring array (before sorting):");
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



