function loadMovies(search = '') {
    const list = document.getElementById('movies');
    list.innerHTML = ''; // ispravljeno innerHtml → innerHTML

    fetch(`https://movie.pequla.com/api/movie?search=${encodeURIComponent(search)}`) // encodeURIComponent za search
        .then(rsp => rsp.json())
        .then(data => {
            const template = document.getElementById('movie-template');

            for (let movie of data) {
                const copy = template.content.cloneNode(true);

                const img = copy.querySelector('.card-img-top');
                img.src = movie.poster;
                img.alt = movie.title;

                copy.querySelector('.card-title').innerText = movie.title;
                copy.querySelector('.card-subtitle').innerText = movie.director.name;
                copy.querySelector('.card-text').innerText = movie.shortDescription;

                copy.querySelector('.card').addEventListener('click', () => {
                    window.location.href = `./details.html?p=${movie.shortUrl}`;
                });

                list.appendChild(copy);
            }
        })
        .catch(err => {
            console.error('Greška pri fetch-u:', err);
            list.innerHTML = '<p class="text-center mt-3">Ne mogu da se učitaju filmovi.</p>';
        });
}

// search dugme i input
const input = document.getElementById('search-input');
const btn = document.getElementById('search-btn'); // ispravljeno, nije više input

btn.addEventListener('click', () => {
    loadMovies(input.value);
});

let timeout;
input.addEventListener('keyup', () => {
    if (input.value !== '') {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            loadMovies(input.value);
        }, 1000);
    }
});

// inicijalno učitavanje
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
});