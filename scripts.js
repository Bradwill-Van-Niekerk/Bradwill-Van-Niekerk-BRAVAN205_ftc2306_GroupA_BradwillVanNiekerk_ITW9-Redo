import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


// Retrieved elements from the DOM using query Selectors
const searchButton = document.querySelector('[data-header-search]')
const searchOverlay = document.querySelector('[data-search-overlay]')
const searchForm = document.querySelector('[data-search-form]')
const searchTitle = document.querySelector('[data-search-title]')
const searchGenres = document.querySelector('[data-search-genres]')
const searchAuthors = document.querySelector('[data-search-authors]')
const searchCancel = document.querySelector('[data-search-cancel]')
const searchSubmit = document.querySelector('[data-search-submit]')


const settingsButton = document.querySelector('[data-header-settings]')
const settingsOverlay = document.querySelector('[data-settings-overlay]')
const settingsForm = document.querySelector('[data-settings-form]')
const settingsTheme = document.querySelector('[data-settings-theme]')
const settingsCancel = document.querySelector('[data-settings-cancel]')


const listItems = document.querySelector('[data-list-items]')
const listMessage = document.querySelector('[data-list-message]')//this is for the search 
const moreButton = document.querySelector('[data-list-button]')
const listActive = document.querySelector('[data-list-active]')//active book preview
const listBlur = document.querySelector('[data-list-blur]')//preview background
const listImage = document.querySelector('[data-list-image]')//preview image 
const listTitle = document.querySelector('[data-list-title]')//preview title
const listSubtitle = document.querySelector('[data-list-subtitle]')//preview auther 
const listDescription = document.querySelector('[data-list-description]')//preview about 
const listClose = document.querySelector('[data-list-close]')//button for preview to close

const idElement = document.querySelector('[id="search"]')

// const aBook = document.querySelectorAll(".preview")



// LOADING OF BOOKS

// displays the first 36 books of array and sets page number to 0

let matches = books
let page = 1;     // keeps track of page number
let range = [0, BOOKS_PER_PAGE]  // an array

// Checks if books is not empty/undefined, and if it is an array.
if (!books || !Array.isArray(books)) {   // Changed && to || because both are invalid. 
    throw new Error('Source required')
}

/* range is an array to check if range is within 0 - 36.
 * Change "< 2" to "=== 2" to avoid future errors.
 */
if (!range && range.length === 2) {   
    throw new Error('Range must be an array with two numbers')
}

/**
 * The createPreview() function takes a book preview object and returns 
 * a button element (showPreview) containing the book preview information in HTML form

 * @param {array} preview is an object array with book properties.
 */
function createPreview(preview) {

    // the authorId, id, title and image are extracted via destructuring
    const { author: authorId, id, image, title, description, published} = preview

    const showPreview = document.createElement('button')
    showPreview.classList = 'preview'
    showPreview.setAttribute('data-preview', id)
    
    // A template literate is used to create an html preview of the book.
    showPreview.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />

        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
            <div class="preview_hidden" id="description">${description}</div>
            <div class="preview_hidden" id="date">${published}</div>
        </div>
    `

    return showPreview
};


const bookpreview = (event) => {

  //Selects the closest preview book 
  const targetOrder = event.target.closest('.preview');

  if (listActive.open) {
      listActive.open = false;
  }

  if (targetOrder) {
      // Display preview overlay.
      listActive.open = true;

      //all elements needed for the preview pulled here
      const previewImage = targetOrder.querySelector('.preview__image');
      const previewTitle = targetOrder.querySelector('.preview__title').innerText;
      const previewAuthor = targetOrder.querySelector('.preview__author').innerText;
      const previewDescription = targetOrder.querySelector('#description').innerHTML;
      const previewDateText = targetOrder.querySelector('#date').innerText;

      const previewSrc = previewImage.src
      
      //asigning emements 
      listImage.src = previewSrc;
      listBlur.src = previewSrc;
      listTitle.innerText = previewTitle;
      listSubtitle.innerText = `${previewAuthor} (${previewDateText.slice(0, 4)})`;
      listDescription.innerText = previewDescription;
  };
};


  listItems.addEventListener("click", bookpreview);
  listClose.addEventListener("click", bookpreview);


  // opens the setting for the filters
const settings = (event) => {
    const { target } = event;
    if (searchOverlay.open === false) {
      searchOverlay.showModal();
    } else if (target === settingsCancel) {
      searchOverlay.close();
    }
  };

  searchButton.addEventListener("click", settings);

const bookFragment = document.createDocumentFragment()

const startIndex = (page - 1) * BOOKS_PER_PAGE
const endIndex = startIndex + BOOKS_PER_PAGE

const bookExtracted = books.slice(startIndex, endIndex)

// loop iterates over the book previews to display on current page 
for (const preview of bookExtracted) {
    
    // creates a book preview button using the createPreview function
    const showPreview = createPreview(preview)
    bookFragment.appendChild(showPreview)
}

// appends the button to the bookFragment container
listItems.appendChild(bookFragment)

/**
 * This sets up a click event listener for the "Show More" button. When clicked, 
 * the code executes the logic to display the next set of book previews.
 */
moreButton.addEventListener('click', () => {
    page++;

    const newStartIndex = (page - 1) * BOOKS_PER_PAGE
    const newEndIndex = newStartIndex + BOOKS_PER_PAGE

    const newBookExtracted = books.slice(newStartIndex, newEndIndex)

    const newBookFragment = document.createDocumentFragment()

    for (const preview of newBookExtracted) {
        const showPreview = createPreview(preview);
        newBookFragment.appendChild(showPreview);
    }

    listItems.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE;
    moreButton.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;

    moreButton.disabled = remaining <= 0;
})


moreButton.innerHTML = /* HTML */
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
    `;



// GENRES AND AUTHORS DROPDOWN

//When searcButton is clicked, it shows a modal by invoking showModal() on dataSearchOverlay
searchButton.addEventListener('click', () => {
    searchOverlay.showModal()
    // searchTitle.focus()
})

//When searchCancel is clicked, it closes modal by invoking close() on dataSearchOverlay
searchCancel.addEventListener('click', () => { 
    searchOverlay.close()
})

//a constent used to create fragments just by calling fagment
const fragment = document.createDocumentFragment();

// a constent used to clear the preview list that is seen before the filter is added
const clearList = () => {
    const list = document.querySelector('[data-list-items]');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    };
};


const addSelectOptions = (selectContainer, dataObj, allOption) => {
    // Create "option" element for "All Genres/Authors"
    const allOptionElement = document.createElement("option");
    allOptionElement.innerText = `All ${allOption}`;
    selectContainer.appendChild(allOptionElement);

    /*
    Loop through object passed in (genres or authors), create option element for
    each, and append to selectContainer */
    for (const [key, val] of Object.entries(dataObj)) {
        const optionElement = document.createElement("option");
        optionElement.dataset.id = key;

        optionElement.innerText = val;
        selectContainer.appendChild(optionElement);
    };
};


const handleSearchBooks = (event) => {
    event.preventDefault()

     // Get title value and save to a variable
    // const titleValue = searchTitle.innerText;
    const titleValue = searchTitle.value;
    // Get genre "select" element
    const genreElement = searchGenres;
    // Get author "select" element
    const authorElement = searchAuthors;
    // Get selected "option" element
    const selectedGenre = genreElement.options[genreElement.selectedIndex];
    // Get selected "option" element
    const selectedAuthor = authorElement.options[authorElement.selectedIndex];
    // Get id value of selected genre element
    const genreId = selectedGenre.getAttribute("data-id");
    // Get id value of selected author element
    const authorId = selectedAuthor.getAttribute("data-id");

    let matchingGenreBooks;
    let matchingAuthorBooks;
    let matchingTitleBooks;

    /*
    Check if the "books" array holds any of the given inputs and if so, save
    those books to thier respective variables. */
    if (genreId != null) {
         matchingGenreBooks = books.filter((book) => book.genres.includes(genreId));
    } else {
        matchingGenreBooks = books;
    };
    if (authorId != null) {
         matchingAuthorBooks = books.filter((book) => book.author === authorId);
    } else {
        matchingAuthorBooks = books;
    };
    if (titleValue != "any") {
        matchingTitleBooks = books.filter((book) => book.title.toLowerCase().includes(titleValue));
    } else {
        matchingTitleBooks = books;
    };

    /*
    From the values declared above, get a final array that comprises all of the
    matching books from the matchingGenreBooks, matchingAuthorBooks and
    matchingTitleBooks arrays. */
    const matchingBooks = matchingGenreBooks.filter((book) =>
        matchingAuthorBooks.includes(book) && matchingTitleBooks.includes(book)
    );
    // Run clearList to remove previous books from the "data-list-items" element.
    clearList();

    // Re-initialise totalBooksShown to 0.
    range = 0;

    // Loop through matchingBooks and create elements for each book.
    for (const book of matchingBooks) {
        const newBook = createPreview(book);
        fragment.appendChild(newBook);
        range += 1
    };

    // Append new book fragment to the DOM.
    listItems.appendChild(fragment);

    /* 
    This conditional checks how many books are being displayed and updates
    the show more buttom accordingly, either changing its text or disabling it. */
    if (range > 0) {
        moreButton.innerText = `Show more (${matchingBooks.length - range})`;
        listMessage.classList.remove("list__message_show");
    } else {
       moreButton.disabled = true;
        listMessage.classList.add("list__message_show");
    };

    // Call handleSearchToggle to close the overlay.
    searchOverlay.close();
};

  searchSubmit.addEventListener('click', handleSearchBooks)

// DAY / NIGHT OPTION

settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal()
})

settingsCancel.addEventListener('click', () => { 
    settingsOverlay.close()
})

//The css object defines two themes, 'day' and 'night'
const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255']
}

//The value of the settingsTheme input is determined based on whether the user's preferred color scheme is dark or not.
settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'


// When the form is submitted, the selected object is created by converting the form data to an object using Object.fromEntries(). 
settingsForm.addEventListener('submit', (event) => { 
    event.preventDefault()
    const formSubmit = new FormData(event.target)
    const selected = Object.fromEntries(formSubmit)

// Depending on the theme selected, the --color-light and --color-dark CSS variables are updated with the corresponding light and dark color values from the css object
    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])     
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    }

    settingsOverlay.close()
})

addSelectOptions(searchGenres, genres, "Genres");
addSelectOptions(searchAuthors, authors, "Authors");