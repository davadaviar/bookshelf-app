const bookShelfLists = [];
const RENDER_EVENT = 'render-book-shelf-list';
const STORAGE_KEY = 'BOOK-SHELF-APPS';
const SAVED_EVENT = 'saved-book-shelf-list';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBookshelfList();
    });

    if (storageIsExist()) {
        loadDataFromStorage();
    }
});

function addBookshelfList() {
    const titleBookShelfList = document.getElementById('inputBookTitle').value;
    const authorBookShelfList = document.getElementById('inputBookAuthor').value;
    const yearBookShelfList = document.getElementById('inputBookYear').value;
    const bookIsCompleteList = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookShelfListObject = generateBookshelfListObject(generatedID, titleBookShelfList, authorBookShelfList, yearBookShelfList, bookIsCompleteList);
    bookShelfLists.push(bookShelfListObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookshelfListObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function findBookShelfList(bookShelfListId) {
    for (const bookShelfListItem of bookShelfLists) {
        if (bookShelfListItem.id === bookShelfListId) {
            return bookShelfListItem;
        }
    }
    return null;
}

function findBookShelfListIndex(bookShelfListId) {
    for (index in bookShelfLists) {
        if (bookShelfLists[index].id === bookShelfListId) {
            return index;
        }
    }
    return -1;
}

function makeBookShelfList(bookShelfListObject) {

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookShelfListObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis : ' +  bookShelfListObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun : ' + bookShelfListObject.year;

    const bookDescription = document.createElement('div');
    bookDescription.classList.add('description');
    bookDescription.append(bookTitle, bookAuthor, bookYear);
    
    const detailsContainer = document.createElement('section');
    detailsContainer.classList.add('details-book');
    detailsContainer.append(bookDescription);

    const bookIcon = document.createElement('section');
    bookIcon.innerHTML = '<img src="assets/images/book-icon.png" alt="icon">';

    const container = document.createElement('article');
    container.classList.add('book-item');
    container.setAttribute('id', `bookShelfList-${bookShelfListObject.id}`);
    container.append(bookIcon, detailsContainer);

    if (bookShelfListObject.isCompleted) {

        const undoButton = document.createElement('button');
        undoButton.classList.add('btn-remove');
        undoButton.innerText = 'Belum Baca';
        undoButton.addEventListener('click', function() {
            undoBookShelfList(bookShelfListObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('btn-delete');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', function() {
            if (confirm('Apakah anda ingin menghapus buku ini dari list ?') == true) {
                alert('Data telah dihapus');
                removeBookShelfList(bookShelfListObject.id);
            } else {
                alert('Hapus data dibatalkan');
            }
        });

        const completeButton = document.createElement('div');
        completeButton.classList.add('action');
        completeButton.append(undoButton, trashButton);

        detailsContainer.append(completeButton);

    } else {

        const undoButton = document.createElement('button');
        undoButton.classList.add('btn-remove');
        undoButton.innerText = 'Selesai Baca';
        undoButton.addEventListener('click', function() {
            addBookshelfListtoComplete(bookShelfListObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('btn-delete');
        trashButton.innerText = 'Hapus';
        trashButton.addEventListener('click', function() {
            if (confirm('Apakah anda ingin menghapus buku ini dari list ?') == true) {
                alert('Data telah dihapus');
                removeBookShelfList(bookShelfListObject.id);
            } else {
                alert('Hapus data dibatalkan')
            }
        });

        const incompleteButton = document.createElement('div');
        incompleteButton.classList.add('action');
        incompleteButton.append(undoButton, trashButton);

        detailsContainer.append(incompleteButton);

    }

    return container;

}

function addBookshelfListtoComplete(bookShelfListId) {
    const bookShelfListTarget = findBookShelfList(bookShelfListId);

    if (bookShelfListTarget == null) return;

    bookShelfListTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookShelfList(bookShelfListId) {
    const bookShelfListTarget = findBookShelfListIndex(bookShelfListId);

    if (bookShelfListTarget === -1) return;

    bookShelfLists.splice(bookShelfListTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookShelfList(bookShelfListId) {
    const bookShelfListTarget = findBookShelfList(bookShelfListId);

    if (bookShelfListTarget === null) return;

    bookShelfListTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function storageIsExist() {
    if (typeof(Storage) === undefined) {
        alert('Browser anda tidak mendukung web storage');
        return false;
    }
    return true;
}

function saveData() {
    if (storageIsExist()) {
        const parsed = JSON.stringify(bookShelfLists);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookShelfList of data) {
            bookShelfLists.push(bookShelfList);
        }
    }
   document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchButton = document.getElementById('searchBookSubmit');
searchButton.addEventListener('click', function() {
    const searchTitle = document.getElementById('searchBookTitle').value.toUpperCase();
    const item = document.querySelectorAll('.book-item');
    const itemTitle = document.getElementsByTagName('h3');
    const inputForm = document.getElementsByClassName('add-book-list')[0];

    for ( let i = 0; i < itemTitle.length; i++) {
        let match = item[i].getElementsByTagName('h3')[0];
        
        inputForm.style.display = 'none';

        if (match) {
            let textValue = match.textContent || match.innerHTML;
    
            if (textValue.toUpperCase().indexOf(searchTitle) > -1) {
                item[i].style.display = "";
            } else {
                item[i].style.display = 'none';
            }
        }
    }

})


document.addEventListener(RENDER_EVENT, function() {

    const incompleteBookShelfList = document.getElementById('incompleteBookShelfList');
    incompleteBookShelfList.innerHTML = "";

    const completeBookShelfList = document.getElementById('completeBookShelfList');
    completeBookShelfList.innerHTML = "";

    for (bookShelfListItem of bookShelfLists) {
        
        const bookShelfListElement = makeBookShelfList(bookShelfListItem);

        if (bookShelfListItem.isCompleted == false) {
            incompleteBookShelfList.append(bookShelfListElement);
        } else {
            completeBookShelfList.append(bookShelfListElement);
        }
    }
})

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})