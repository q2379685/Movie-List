const BASE_URL = 'https://movie-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/movies/';
const POSTER_URL = BASE_URL +  '/posters/';

const movies = [];

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data){
    let rawHTML = '';

    data.forEach((item) => {
        // console.log(item.image);
        // console.log(item.title);

        rawHTML += 
        `<div class="col-3">
            <div class="mb-2">
              <div class="card">
                <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie-poster">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-show-movie"
                    data-bs-toggle="modal"
                    data-bs-target="#movie-modal"
                    data-id="${item.id}"
                    >更多</button>
                    <button class="btn btn-info btn-add-movie"
                    data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          </div>`;

    });
    //過程
    dataPanel.innerHTML = rawHTML;

}

function showMovieModal(id){
  const modalTitle = document.querySelector('#movie-modal-title');
  const modalImage = document.querySelector('#movie-modal-image');
  const modalDate = document.querySelector('#movie-modal-date');
  const modalDescription = document.querySelector('#movie-modal-description');

  axios.get(INDEX_URL + id).then(response => {
    // response.data.results
    // console.log(response.data.results)
    const data = response.data.results;

    // console.log(data)

    modalTitle.innerText = data.title;
    modalImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
    modalDate.innerText = data.release_date
    modalDescription.innerHTML = data.description
  })
}

function addFavoriteList(id){
  function isMovieIdMatched(movie){
    console.log(movie)
    return movie.id === id
  }

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(isMovieIdMatched)
  if(list.some((movie) =>  movie.id === id)){
    return alert('已經在收藏清單')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener("click", function onPanelClicked(event){
  if(event.target.matches('.btn-show-movie')){
    // console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  }else if(event.target.matches('.btn-add-movie')){
    addFavoriteList(Number(event.target.dataset.id))
    // console.log(event.target)
  }
})

searchForm.addEventListener("submit", function onSearchFormSubmited(event){
  // console.log(event);
  event.preventDefault();

  const keyword = searchInput.value.toLowerCase().trim()
  let filteredMovies = []

  // if(!keyword.length){
  //   return alert('請輸入有效字串');
  // }

  // 方法一迴圈
  // for(const movie of movies){
  //   if(movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push(movie)
  //   }
  // }

  // 方法二filter
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if(filteredMovies.length === 0){
    return alert('找不到' + keyword + '的相關內容');
  }

  renderMovieList(filteredMovies)
})

axios.get(INDEX_URL).then((response) => {
    movies.push(...response.data.results);
    // console.log(movies);
    renderMovieList(movies);
    
})
// .catch((err) => {
//     console.log(err)
// })