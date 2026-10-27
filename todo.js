let items = [];
let itemList = document.getElementById('item-list');
loadList();

function showList() {
    if (items != null) {
        itemList.innerHTML = items.map((item) => `
        <li id='${slugfy(item.name)}'>
            <label for='${slugfy(item.name) + 'checkbox'}'>
                <input type='checkbox' id='${slugfy(item.name) + 'checkbox'}' ${item.checked}>
                ${item.name}
            </label>
            <button id='${slugfy(item.name) + 'delete'}' class='delete'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path></svg>
            </button>
        </li>
        `).join('')

        console.log('Loaded list ' + JSON.stringify(items));
    }
    readCheckbox();
    deleteTask();
}

function readCheckbox() {
    var checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function checked() {
            if (items.map((item) => {
                if (item.elementId + 'checkbox' == checkbox.id) {
                    if (item.checked == '') {
                        item.checked = 'checked';
                    } else if (item.checked == 'checked') {
                        item.checked = '';
                    }
                    saveList();
                    console.log('Marcou como ' + checkbox.checked + ' ' + checkbox.id);
                }
            }));
        });
    });
}

function deleteTask() {
    var deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener('click', function deleted() {
            var novoArray = items.filter((item) => (item.elementId + 'delete' !== deleteButton.id));
            items = novoArray;
            saveList();
            showList();
            console.log(deleteButton.id + ' delete button clicked');
        });
    });
}

document.querySelector('#add').addEventListener("click", function clickPlus() {
    addItem();
});

document.querySelector('#item-name').addEventListener('keypress', function Key(e) {
    if (e.key == 'Enter') {
        addItem();
    }
});

function addItem(itemName) {
    if (document.getElementById('item-name').value != "") {
        itemName = document.getElementById('item-name').value;
    }

    if (itemName != "") {
        if (document.querySelector(`#${slugfy(itemName)}`)) {
            console.log('Essa tarefa já existe');
        } else {
            let item = { 'elementId': slugfy(itemName), 'name': itemName, 'checked': '' };
            items.push(item);
            saveList();

            console.log('Add item ' + itemName);
            showList();
        }
    }
}

document.querySelector('#clear').addEventListener("click", function clearAll() {
    items = [];
    saveList();

    console.log('cleared ' + JSON.stringify(items));
    showList();
});

function saveList() {
    localStorage.setItem('items', JSON.stringify(items));
}

function loadList() {
    if (localStorage.getItem('items') != null) {
        items = JSON.parse(localStorage.getItem('items'));
    }

    showList();
}

function slugfy(string) {
    return (string.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''));
}