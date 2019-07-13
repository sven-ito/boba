// ------------------------------------------------------------------------------

class Choice {

    constructor(numberOfOptions = 2) {

        if (typeof numberOfOptions === "number" && numberOfOptions > 0)
            this.numberOfOptions = numberOfOptions;

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

        if (typeof pickedOption === "number" && pickedOption >= 0 && pickedOption < this.numberOfOptions)
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
const RESTORE_BUTTON = document.getElementById('restoreButton');
const COMBINATION_MATRIX_SPACE = document.getElementById('combinationMatrixSpace');
const CAROUSEL_CONTENT = document.getElementById('carouselContent');
const CAROUSEL = document.getElementById('carouselExampleControls');

// All data structures for (processed) inputs - as global variables
var items = [];
var scoring = [];
var lines = [];


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
 */
function addItems(lines) {

    ITEM_LIST.innerHTML = "";

    for (let line of lines) {
        addItem(line);
    }

    // Collect list items into an array / list
    for (let i = 0; i < ITEM_LIST.children.length; i++) {
        items[i] = ITEM_LIST.children[i].innerText;
    }

}


function resetScore() {

    for (let i = 0; i < items.length; i++) {
        scoring[i] = 0;
    }
}

/**
 * Creates all the choices to pick for the prioritization process.
 */
function createChoices(items) {

    choices = [];

    //Create combinations
    for (let i = 0; i < items.length - 1; i++) {

        console.log("Combining item ... " + items[i]);

        let currentSubList = items.slice(i + 1, items.length)

        console.log("... with:");
        console.log(currentSubList);
        for (let j = 0; j < currentSubList.length; j++) {

            console.log("Resulting combination (indices):");
            console.log([i, i + 1 + j]);

            // Replaced by associative array with key = indices, e.g. "1-2" means item 1 vs. 2
            let key = i + "-" + (i + 1 + j)
            choices[key] = new Choice();
        }
    }

    console.log("All resulting choice combinations:");
    console.log(choices);

    return choices;
}


function renderChoicesCarousel(choices) {

    CAROUSEL_CONTENT.innerHTML = '';
    let i = 1;
    let n = 0;

    for (let key in choices) {
        n++;
    }

    for (let key in choices) {

        // Parse option item indices from key
        let options = key.split('-');

        let div = document.createElement('div');
        div.id = 'choice_' + key;

        if (i == 1)
            div.className = 'carousel-item active jumbotron bg-dark text-center text-white';
        else
            div.className = 'carousel-item jumbotron bg-dark text-center text-white';

        let counter = document.createElement('small');
        counter.innerText = i + '/' + n;
        div.appendChild(counter);

        let question = document.createElement('h2');
        question.innerHTML = 'If you could only have <em>ONE</em>:';
        div.appendChild(question);

        let separatorLine = document.createElement('hr');
        div.appendChild(separatorLine);

        let row = document.createElement('div');
        row.className = 'row';

        let indexOptionA = options[0];
        console.log("Option A:");
        console.log(options[0]);

        let divOptionA = document.createElement('div');
        divOptionA.className = 'col-sm text-center';
        let buttonOptionA = document.createElement('button');

        if (choices[key].getPickedOption() == 0)
            buttonOptionA.className = 'btn btn-success';
        else
            buttonOptionA.className = 'btn btn-dark';

        buttonOptionA.appendChild(document.createTextNode(items[indexOptionA]));
        buttonOptionA.dataset.indexOption = indexOptionA;
        buttonOptionA.addEventListener(
            'click',
            function () {
                //console.log("Option A: " + this.dataset.indexOption);
                //scoring[this.dataset.indexOption]++;

                let key = this.parentElement.parentElement.parentElement.id.split('_')[1];
                choices[key].setPickedOption(0);

                let allButtons = this.parentElement.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
                    //allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';

                storeEverything();
            },
            false
        );
        divOptionA.appendChild(buttonOptionA);
        row.appendChild(divOptionA);

        let indexOptionB = options[1];
        console.log("Option B:");
        console.log(options[1]);

        let divOptionB = document.createElement('div');
        divOptionB.className = 'col-sm text-center';
        let buttonOptionB = document.createElement('button');

        if (choices[key].getPickedOption() == 1)
            buttonOptionB.className = 'btn btn-success';
        else
            buttonOptionB.className = 'btn btn-dark';

        buttonOptionB.appendChild(document.createTextNode(items[indexOptionB]));
        buttonOptionB.dataset.indexOption = indexOptionB;
        buttonOptionB.addEventListener(
            'click',
            function () {
                //console.log("Option B: " + this.dataset.indexOption);
                //scoring[this.dataset.indexOption]++;

                let key = this.parentElement.parentElement.parentElement.id.split('_')[1];
                choices[key].setPickedOption(1);

                let allButtons = this.parentElement.parentElement.parentElement.getElementsByClassName('btn');
                for (let i = 0; i < allButtons.length; i++) {
                    //allButtons[i].disabled = true;
                    allButtons[i].className = 'btn btn-dark';
                }

                this.className = 'btn btn-success';

                storeEverything();
            },
            false
        );
        divOptionB.appendChild(buttonOptionB);
        row.appendChild(divOptionB);

        div.appendChild(row);

        separatorLine = document.createElement('hr');
        div.appendChild(separatorLine);

        let commentDiv = document.createElement('div');
        commentDiv.className = 'input-group w-50';
        commentDiv.style = 'left: 180px';

        let commentDivLeft = document.createElement('div');
        commentDivLeft.className = 'input-group-prepend';

        let commentDivLeftSpan = document.createElement('span');
        commentDivLeftSpan.className = 'input-group-text';
        commentDivLeftSpan.innerText = 'Why?';

        commentDivLeft.appendChild(commentDivLeftSpan);

        commentDiv.appendChild(commentDivLeft);

        let optionComment = document.createElement('input');
        optionComment.type = 'text';
        optionComment.className = 'form-control';
        optionComment.placeholder = 'Your reason ...';

        if (choices[key].getComment() != '')
            optionComment.value = choices[key].getComment();

        optionComment.addEventListener(
            'blur',
            function () {

                let key = this.parentElement.parentElement.id.split('_')[1];
                choices[key].setComment(this.value);

                storeEverything();
            },
            false
        );
        commentDiv.appendChild(optionComment);

        div.appendChild(commentDiv);

        CAROUSEL_CONTENT.appendChild(div);

        i++;
    }

    CAROUSEL.style = "visibility: visbible"
}


/**
 * Creates and renders all the choices to pick for the prioritization process.
 */
function renderChoices(choices) {

    CHOICES_LIST.innerHTML = '';

    for (let key in choices) {

        // Parse option item indices from key
        let options = key.split('-');

        // Create new li element
        let li = document.createElement('li');
        li.className = 'list-group-item';

        let div = document.createElement('div');
        div.className = 'row';
        div.id = 'choice_' + key;

        let indexOptionA = options[0];
        console.log("Option A:");
        console.log(options[0]);

        let divOptionA = document.createElement('div');
        divOptionA.className = 'col-sm';
        let buttonOptionA = document.createElement('button');

        if (choices[key].getPickedOption() == 0)
            buttonOptionA.className = 'btn btn-success';
        else
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

                storeEverything();
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

        if (choices[key].getPickedOption() == 1)
            buttonOptionB.className = 'btn btn-success';
        else
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

                storeEverything();
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

        if (choices[key].getComment() != '')
            optionComment.value = choices[key].getComment();

        optionComment.addEventListener(
            'blur',
            function () {

                let key = this.parentElement.parentElement.id.split('_')[1];
                choices[key].setComment(this.value);

                storeEverything();
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

    resetScore();
    EVAL_LIST.innerHTML = '';

    // Prepare / fill scoring array

    for (key in choices) {

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

    renderCombinationMatrix();
}

function restoreEverything() {

    if (isEverythingStored()) {

        items = loadItems();
        choices = loadChoices();

        addItems(items);
        renderChoices(choices);
    }

    else
        console.log("Storage error!");
}

function isEverythingStored() {

    return (localStorage.getItem('all-items') != null && localStorage.getItem('all-choice-keys') != null);
}

function storeEverything() {

    localStorage.clear();
    console.log('Storing everything in localStorage!');

    storeItems();
    storeChoices();
}

function storeItems() {

    localStorage.setItem('all-items', JSON.stringify(items));
}

function loadItems() {

    let items = JSON.parse(localStorage.getItem('all-items'));

    return items;
}

function storeChoices() {

    let allKeys = [];

    for (let key in choices) {
        localStorage.setItem(key, JSON.stringify(choices[key]));
        allKeys.push(key);
    }

    localStorage.setItem('all-choice-keys', JSON.stringify(allKeys));
}

function loadChoices() {

    let choices = [];

    let allKeys = JSON.parse(localStorage.getItem('all-choice-keys'));

    for (let key of allKeys) {

        let tempChoice = JSON.parse(localStorage.getItem(key));
        let choice = new Choice(tempChoice.numberOfOptions);
        choice.setComment(tempChoice.comment);
        choice.setPickedOption(tempChoice.pickedOption);
        choices[key] = choice;
    }

    return choices;
}

function renderCombinationMatrix() {

    COMBINATION_MATRIX_SPACE.innerHTML = '';

    let table = document.createElement('table');
    table.className = 'table';

    let head = document.createElement('thead');
    table.appendChild(head);

    let row = document.createElement('tr');

    let header = document.createElement('th');
    header.scope = "col";
    header.innerText = "VS";
    row.appendChild(header);

    for (let i = 0; i < items.length; i++) {

        let header = document.createElement('th');
        header.scope = "col";
        header.innerText = i;
        row.appendChild(header);
    }

    head.appendChild(row);

    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (let i = 0; i < items.length; i++) {

        let row = document.createElement('tr');

        let header = document.createElement('th');
        header.scope = "col";
        header.innerText = i;
        row.appendChild(header);

        table.appendChild(row);

        for (let j = 0; j < items.length; j++) {

            let column = document.createElement('td');

            if (choices[i + '-' + j] != undefined) {
                if (choices[i + '-' + j].pickedOption == 0)
                    column.innerText = i;
                if (choices[i + '-' + j].pickedOption == 1)
                    column.innerText = j;
            }
            else
                column.bgColor = '#000000';

            if (i == j)
                column.bgColor = '#000000';

            row.appendChild(column);
        }
    }

    COMBINATION_MATRIX_SPACE.appendChild(table);

    table = document.createElement('table');
    table.className = 'table';

    for (let i = 0; i < items.length; i++) {

        row = document.createElement('tr');
        column = document.createElement('td');
        column.innerText = i;
        row.appendChild(column);
        column = document.createElement('td');
        column.innerText = items[i];
        row.appendChild(column);

        table.appendChild(row);
    }

    COMBINATION_MATRIX_SPACE.appendChild(table);
}

function init() {

    // Add event listeners
    ITEM_LIST_FORM.addEventListener('submit', function (e) {

        // Hack to circumvent form default behavior (redirecting to another page)
        e.preventDefault();

        // Assumption: Lines / items are separated with new line character
        lines = TEXT_AREA.value.split("\n");
        addItems(lines);
    });

    CHOICES_FORM.addEventListener('submit', function (e) {

        // Hack to circumvent form default behavior (redirecting to another page)
        e.preventDefault();

        resetScore();

        console.log("Scoring array set to 0:");
        console.log(scoring);

        let choices = createChoices(lines);
        //renderChoices(choices);
        renderChoicesCarousel(choices);

    });
    EVAL_BUTTON.addEventListener('click', evaluatePrios);
    RESTORE_BUTTON.addEventListener('click', restoreEverything);

    //window.setInterval(storeEverything, 5000);

}

document.addEventListener("DOMContentLoaded", init);





