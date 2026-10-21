let items = [];
let itemList = document.getElementById('item-list');
loadList();

function showList() {
    if (items != null) {
        itemList.innerHTML = items.map((item) => `
        <li id='${item.name.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}'>
            <label for='${item.name.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + 'checkbox'}'>
                <input type='checkbox' id='${item.name.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + 'checkbox'}' ${item.checked}>
                ${item.name}
            </label>
            <button id='${item.name.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + 'delete'}' class='delete'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a12,12,0,0,0,0,24h4V208a20,20,0,0,0,20,20H192a20,20,0,0,0,20-20V72h4a12,12,0,0,0,0-24ZM100,36a4,4,0,0,1,4-4h48a4,4,0,0,1,4,4V48H100Zm88,168H68V72H188ZM116,104v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Zm48,0v64a12,12,0,0,1-24,0V104a12,12,0,0,1,24,0Z"></path></svg>
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

function addItem() {
    let itemName = document.getElementById('item-name').value;

    if (itemName != "") {
        if (document.querySelector(`#${itemName.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`)) {
            console.log('Essa tarefa já existe');
        } else {
            let item = { 'elementId': itemName.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''), 'name': itemName, 'checked': '' };
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