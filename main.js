// ------------------------------------------------------------------------------

class Choice {

    constructor(numberOfOptions = 2) {

        if (typeof numberOfOptions === "number" && numberOfOptions > 0)
            this.numberOfOptions = numberOfOptions;
        else
            throw Error("numberOfOptions must be a number > 0!");

        this.pickedOption = -1;
        this.comment = "";
    }

    getComment() {
        return this.comment;
    }

    setComment(comment) {

        if (typeof comment === "string")
            this.comment = comment;
        else
            throw Error("comment must be a String!");
    }

    getPickedOption() {
        return this.pickedOption;
    }

    setPickedOption(pickedOption) {

        if (typeof pickedOption === "number" && pickedOption >= -1 && pickedOption < this.numberOfOptions)
            this.pickedOption = pickedOption;
        else
            throw Error("pickedOption must be a number >= -1 and may not >= numberOfOptions!");
    }

}

class Utils {

    /**
     * Sorts an array and additionally returns the indices relative to the original sort order.
     * Modified to reverse sort.
     * from https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
     * @param  {} toSort
     */
    static sortWithIndeces(toSort) {

        if (toSort.length == 0)
            throw Error("toSort may not be empty!");

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

    static factorial_iterative(n) {
        var rval = 1;
        for (var i = 2; i <= n; i++)
            rval = rval * i;
        return rval;
    }
}

class Storage {

    static clearEverything() {

        localStorage.clear();

        Storage.items = [];
        Storage.scoring = [];
        Storage.lines = [];
    }

    static resetScore() {

        if (Storage.scoring === undefined)
            Storage.scoring = [];

        for (let i = 0; i < Storage.items.length; i++) {
            Storage.scoring[i] = 0;
        }
    }

    static restoreEverything() {

        if (Storage.isEverythingStored()) {

            Storage.loadItems();
            Storage.loadChoices();
        }

        else
            console.log("Storage error!");
    }

    static isEverythingStored() {

        return (localStorage.getItem('all-items') != null && localStorage.getItem('all-choice-keys') != null);
    }

    static storeEverything() {

        localStorage.clear();
        console.log('Storing everything in localStorage!');

        Storage.storeItems();
        Storage.storeChoices();
    }

    static storeItems() {

        localStorage.setItem('all-items', JSON.stringify(Storage.items));
    }

    static loadItems() {

        Storage.items = JSON.parse(localStorage.getItem('all-items'));
    }

    static storeChoices() {

        let allKeys = [];

        for (let key in Storage.choices) {
            localStorage.setItem(key, JSON.stringify(Storage.choices[key]));
            allKeys.push(key);
        }

        localStorage.setItem('all-choice-keys', JSON.stringify(allKeys));
    }

    static loadChoices() {

        Storage.choices = [];

        let allKeys = JSON.parse(localStorage.getItem('all-choice-keys'));

        for (let key of allKeys) {

            let tempChoice = JSON.parse(localStorage.getItem(key));
            let choice = new Choice(tempChoice.numberOfOptions);
            choice.setComment(tempChoice.comment);
            choice.setPickedOption(tempChoice.pickedOption);
            Storage.choices[key] = choice;
        }
    }

}

class UI {

    /**
     * Adds a new item to the item list.
     * @param  {} newItem
     */
    static addItem(newItem = "Empty") {

        if (typeof newItem != "string")
            throw Error("comment must be a String!");

        let li = document.createElement('li');
        li.className = 'list-group-item';
        li.appendChild(document.createTextNode(newItem));

        ITEM_LIST.appendChild(li);
    }

    /**
     * Parses the lines in the text area into single items.
     */
    static addItems(lines) {

        if (lines.length == 0)
            throw Error("lines may not be empty!");

        // Calculate number of comparisons:
        let n = lines.length;
        let k = 2;
        let n_over_k = Utils.factorial_iterative(n) / (Utils.factorial_iterative(k) * Utils.factorial_iterative(n - k));


        if (n_over_k >= 1000) {

            let alert = document.createElement("div");

            alert.className = "alert alert-danger";
            alert.role = "alert";
            alert.innerText = "You will have to make " + n_over_k + " choices. Aborting!";
            document.getElementById("addForm").appendChild(alert);

            throw Error("Too many comparisons!");
        }

        if (n_over_k > 100) {

            let alert = document.createElement("div");

            alert.className = "alert alert-warning";
            alert.role = "alert";
            alert.innerText = "You will have to make " + n_over_k + " choices. Consider using a smaller sub-list of your items."
            document.getElementById("addForm").appendChild(alert);
        }

        for (let i = 0; i < lines.length; i++) {
            Storage.items[i] = lines[i];
            console.log(lines[i]);
        }
    }

    static renderChoicesCarousel(choices) {

        if (typeof choices === 'undefined' || Object.keys(choices).length == 0)
            throw Error("choices may not be empty!");

        CAROUSEL_CONTENT.innerHTML = '';
        let i = 1;
        let n = Object.keys(choices).length;
        for (let key in choices) {

            // Parse option item indices from key
            let options = key.split('-');

            let div = document.createElement('div');

            div.id = 'choice_' + key;

            if (i == 1)
                div.className = 'carousel-item active jumbotron bg-dark text-center text-white';
            else
                div.className = 'carousel-item jumbotron bg-dark text-center text-white';

            let buttonOptionAId = 'choice_' + key + '_0';
            let buttonOptionBId = 'choice_' + key + '_1';
            let optionCommentId = 'choice_' + key + '_c';

            let indexOptionA = options[0];
            let indexOptionB = options[1];

            console.log("Option A:");
            console.log(options[0]);

            console.log("Option B:");
            console.log(options[1]);

            let buttonOptionAClassName;

            if (choices[key].getPickedOption() == 0)
                buttonOptionAClassName = 'btn btn-success';
            else
                buttonOptionAClassName = 'btn btn-dark';

            let buttonOptionBClassName;

            if (choices[key].getPickedOption() == 1)
                buttonOptionBClassName = 'btn btn-success';
            else
                buttonOptionBClassName = 'btn btn-dark';

            let optionCommentValue = '';

            if (choices[key].getComment() != '')
                optionCommentValue = choices[key].getComment();

            let divInnerHTML = `
            <small>${i + '/' + n}</small>
            <h2>If you could only have <em>ONE</em>:</h2>
            <hr>
            <div class="row">
                <div class="col-sm text-center"><button id="${buttonOptionAId}" class="${buttonOptionAClassName}"
                        data-index-option="${indexOptionA}">${Storage.items[indexOptionA]}</button></div>
                <div class="col-sm text-center"><button id="${buttonOptionBId}" class="${buttonOptionBClassName}"
                        data-index-option="${indexOptionB}">${Storage.items[indexOptionB]}</button></div>
            </div>
            <hr>
            <div class="input-group w-50" style="left: 180px;">
                <div class="input-group-prepend"><span class="input-group-text">Why?</span></div><input type="text"
                    class="form-control" placeholder="Your reason ..." id="${optionCommentId}" value="${optionCommentValue}">
            </div>
            `;

            div.innerHTML = divInnerHTML;

            let buttonOptionA = div.querySelector("#"+buttonOptionAId); 
            buttonOptionA.addEventListener(
                'click',
                function () {
                    let key = this.parentElement.parentElement.parentElement.id.split('_')[1];
                    UI.pickOption(key, 0);

                    if (Storage.quickMode)
                        document.getElementsByClassName('carousel-control-next')[0].click();
                },
                false
            );

            let buttonOptionB = div.querySelector("#"+buttonOptionBId); 
            buttonOptionB.addEventListener(
                'click',
                function () {
                    let key = this.parentElement.parentElement.parentElement.id.split('_')[1];
                    UI.pickOption(key, 1);

                    if (Storage.quickMode)
                        document.getElementsByClassName('carousel-control-next')[0].click();
                },
                false
            );

            let optionComment = div.querySelector("#"+optionCommentId); 
            optionComment.addEventListener(
                'blur',
                function () {

                    let key = this.parentElement.parentElement.id.split('_')[1];
                    choices[key].setComment(this.value);

                    Storage.storeEverything();
                },
                false
            );

            CAROUSEL_CONTENT.appendChild(div);

            i++;
        }

        CAROUSEL.style = "visibility: visbible"
    }

    /**
     * Creates and renders all the choices to pick for the prioritization process.
     */
    static renderChoices(choices) {

        if (typeof choices === 'undefined' || Object.keys(choices).length == 0)
            throw Error("choices may not be empty!");

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

            buttonOptionA.appendChild(document.createTextNode(Storage.items[indexOptionA]));
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

                    Storage.storeEverything();
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

            buttonOptionB.appendChild(document.createTextNode(Storage.items[indexOptionB]));
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

                    Storage.storeEverything();
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

                    Storage.storeEverything();
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

    static renderCombinationMatrix() {

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

        for (let i = 0; i < Storage.items.length; i++) {

            let header = document.createElement('th');
            header.scope = "col";
            header.innerText = i;
            row.appendChild(header);
        }

        head.appendChild(row);

        let tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (let i = 0; i < Storage.items.length; i++) {

            let row = document.createElement('tr');

            let header = document.createElement('th');
            header.scope = "col";
            header.innerText = i;
            row.appendChild(header);

            table.appendChild(row);

            for (let j = 0; j < Storage.items.length; j++) {

                let column = document.createElement('td');

                if (Storage.choices[i + '-' + j] != undefined) {
                    if (Storage.choices[i + '-' + j].pickedOption == 0)
                        column.innerText = i;
                    if (Storage.choices[i + '-' + j].pickedOption == 1)
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

        for (let i = 0; i < Storage.items.length; i++) {

            row = document.createElement('tr');
            let column = document.createElement('td');
            column.innerText = i;
            row.appendChild(column);
            column = document.createElement('td');
            column.innerText = Storage.items[i];
            row.appendChild(column);

            table.appendChild(row);
        }

        COMBINATION_MATRIX_SPACE.appendChild(table);
    }

    static pickOption(key, optionIndex) {

        //console.log(pickedButton);

        if (typeof optionIndex != "number" || optionIndex < 0)
            throw Error("optionIndex must be an index / number >= 0!");

        Storage.choices[key].setPickedOption(optionIndex);

        let thisButtonAncestorDiv = document.getElementById('choice_' + key);

        let allButtons = thisButtonAncestorDiv.getElementsByClassName('btn');
        for (let i = 0; i < allButtons.length; i++) {
            //allButtons[i].disabled = true;
            allButtons[i].className = 'btn btn-dark';
        }

        let thisButton = document.getElementById('choice_' + key + '_' + optionIndex);
        thisButton.className = 'btn btn-success';

        Storage.storeEverything();
    }

}

// ------------------------------------------------------------------------------

// All relevant HTML components

const TEXT_AREA = document.getElementById('prioItems');
const ITEM_LIST_FORM = document.getElementById('addForm');
const CHOICES_FORM = document.getElementById('collectForm');
const CHOICES_LIST = document.getElementById('choicesList');
const EVAL_LIST = document.getElementById('evaluationList');
const EVAL_BUTTON = document.getElementById('evaluationButton');
const RESTORE_BUTTON = document.getElementById('restoreButton');
const START_BUTTON = document.getElementById('startButton');
const COMBINATION_MATRIX_SPACE = document.getElementById('combinationMatrixSpace');
const CAROUSEL_CONTENT = document.getElementById('carouselContent');
const CAROUSEL = document.getElementById('carouselExampleControls');
const QUICK_MODE = document.getElementById('quickMode');
const QUICK_MODE_LABEL = document.getElementById('quickModeLabel');

/**
 * Creates all the choices to pick for the prioritization process.
 */
function createChoices(items) {

    if (items.length == 0)
        throw Error("items may not be empty!");

    Storage.choices = [];

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
            Storage.choices[key] = new Choice();
        }
    }

    console.log("All resulting choice combinations:");
    console.log(Storage.choices);
}

/**
 * Evaluates the choices return a newly prioritized item list
 * @param  {} e
 */
function evaluatePrios(e) {

    Storage.resetScore();
    EVAL_LIST.innerHTML = '';

    // Prepare / fill scoring array

    if (typeof Storage.choices === 'undefined' || Object.keys(Storage.choices).length == 0)
        throw Error("choices may not be empty!");

    for (key in Storage.choices) {

        let indexPickedOption = Storage.choices[key].getPickedOption();
        let actualItemIndex = key.split('-')[indexPickedOption];
        Storage.scoring[actualItemIndex]++;
    }

    console.log("Scoring array (before sorting):");
    console.log(Storage.scoring);

    Utils.sortWithIndeces(Storage.scoring);

    for (let i = 0; i < Storage.scoring.length; i++) {

        // Create new li element
        let li = document.createElement('li');
        li.className = 'list-group-item';

        li.appendChild(document.createTextNode(Storage.items[Storage.scoring.sortIndices[i]] + " : " + Storage.scoring[i]));
        EVAL_LIST.appendChild(li);

    }

    UI.renderCombinationMatrix();
}

function init() {

    Storage.quickMode = false;

    // Add event listeners
    START_BUTTON.addEventListener('click', function (e) {

        // Hack to circumvent form default behavior (redirecting to another page)
        e.preventDefault();

        Storage.clearEverything();

        // Assumption: Lines / items are separated with new line character
        Storage.lines = TEXT_AREA.value.split("\n");
        UI.addItems(Storage.lines);

        Storage.resetScore();

        console.log("Scoring array set to 0:");
        console.log(Storage.scoring);

        createChoices(Storage.lines);
        UI.renderChoicesCarousel(Storage.choices);
    });

    EVAL_BUTTON.addEventListener('click', evaluatePrios);
    RESTORE_BUTTON.addEventListener('click', (event) => {

        Storage.restoreEverything();
        UI.addItems(Storage.items);
        UI.renderChoicesCarousel(Storage.choices);
    });

    QUICK_MODE.addEventListener('click', (event) => {
        Storage.quickMode = QUICK_MODE.checked;
    });

    window.addEventListener('keydown', (event) => {

        let currentAcrouselDiv = document.getElementsByClassName('active')[0];

        if (event.key !== undefined && currentAcrouselDiv !== undefined) {

            let buttonName = '';
            let commentName = '';
            let comment = '';

            commentName = currentAcrouselDiv.id + "_c";
            comment = document.getElementById(commentName);

            switch (event.key) {
                case 'a':

                    if (document.activeElement !== comment) {
                        buttonName = currentAcrouselDiv.id + "_0";
                        let buttonA = document.getElementById(buttonName);
                        buttonA.click();
                    }

                    break;

                case 'b':

                    if (document.activeElement !== comment) {
                        buttonName = currentAcrouselDiv.id + "_1";
                        let buttonB = document.getElementById(buttonName);
                        buttonB.click();
                    }

                    break;

                case 'Tab':

                    event.preventDefault();
                    comment.focus();
                    break;

                case 'ArrowRight':

                    if (document.activeElement !== comment)
                        document.getElementsByClassName('carousel-control-next')[0].click();
                    break;

                case 'ArrowLeft':

                    if (document.activeElement !== comment)
                        document.getElementsByClassName('carousel-control-prev')[0].click();
                    break;

                case 'Enter':

                    if (document.activeElement === comment)
                        comment.blur();
                    document.getElementsByClassName('carousel-control-next')[0].click();
                    break;

                default: return;
            }
        }
    })

}

document.addEventListener("DOMContentLoaded", init);