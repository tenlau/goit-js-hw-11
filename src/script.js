const API_KEY = '22910062-3497cb46ee95463a66c6aaf70';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;
let currentQuery = '';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSearch);
loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  currentQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreButton.classList.add('hidden');
  if (currentQuery === '') {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }
  fetchImages(currentQuery, currentPage);
}

function onLoadMore() {
  fetchImages(currentQuery, ++currentPage);
}

function fetchImages(query, page) {
  console.log(`Fetching images for query: "${query}", page: ${page}`);  // Debug log
  axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 20,
      },
    })
    .then(response => {
      const { hits, totalHits } = response.data;
      console.log(`Total Hits: ${totalHits}, Hits Length: ${hits.length}`);  // Debug log
      if (hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      renderGallery(hits);
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (gallery.childElementCount >= totalHits) {
        loadMoreButton.classList.add('hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreButton.classList.remove('hidden');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page.');
      console.error('Error fetching images:', error);
    });
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      return `
      <a href="${image.largeImageURL}" class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b> ${image.likes}</p>
          <p class="info-item"><b>Views</b> ${image.views}</p>
          <p class="info-item"><b>Comments</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
      </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
  smoothScroll();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
