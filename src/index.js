//Fetch Requests

//GET request function
function getResource(url) {
    return fetch(url)
    .then(res => res.json())
}

//DELETE request function
function deleteResource(url) {
    return fetch(url, {
        method: 'DELETE'
    })
    .then(res => res.json())
}

//POST request function
function postResource(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
}

//Invoke initial GET request to populate quotes
getResource('http://localhost:3000/quotes?_embed=likes')
.then(quoteData => quoteData.forEach(renderQuote))
.catch(e => console.error(e));


//Render quotes
const quoteList = document.getElementById('quote-list');

function renderQuote(quote) {
    const quoteCard = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const pQuote = document.createElement('p');
    const author = document.createElement('footer');
    const lineBreak = document.createElement('br');
    const likeBtn = document.createElement('button');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button');

    quoteCard.setAttribute('quote-id', quote.id);
    pQuote.textContent = quote.quote;
    author.textContent = quote.author;
    likeBtn.textContent = 'Likes: ';
    if (quote.likes) {
        span.textContent = quote.likes.length;
    } else {
        span.textContent = 0;
    }
    span.setAttribute('span-id', quote.id);
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('delete-id', quote.id);

    deleteBtn.addEventListener('click', (event) => handleDelete(event))
    likeBtn.addEventListener('click', () => handleLike(quote))

    likeBtn.append(span);
    blockquote.append(pQuote, author, lineBreak, likeBtn, deleteBtn);
    quoteCard.append(blockquote);
    quoteList.append(quoteCard);
}


//Form handling
const form = document.getElementById('new-quote-form')

form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleForm(event);
    form.reset();
})

function handleForm(event) {
    const quote = {
        quote: event.target.quote.value,
        author: event.target.author.value
    }

    postResource('http://localhost:3000/quotes', quote)
    .then(quote => renderQuote(quote))
    .catch(e => console.log(e));
}


//Delete function
function handleDelete(event) {
   const id = event.target.getAttribute('delete-id');

    deleteResource(`http://localhost:3000/quotes/${id}`)
    .then(()=> {
        const quoteCard = document.querySelector(`[quote-id = '${id}']`);
        quoteCard.remove();
    })
}

//Like handling
function handleLike(quote) {
    let likeObj = {'quoteId': quote.id};

    postResource('http://localhost:3000/likes', likeObj)
    .then(() => {
        const span = document.querySelector(`[span-id = '${quote.id}']`);
        likeCount = parseInt(span.textContent);
        likeCount++;
        span.textContent = likeCount;
    })
    .catch(e => console.error(e));
}