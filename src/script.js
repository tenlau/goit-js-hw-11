axios.defaults.headers.common['x-api-key'] = 'live_KVqvwaAa6teI6yX5S6NngCptrawdrNzNRIoT6vNRhC0X6ivirP6Q0EQLI3FGsEwk';

const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const breedSelect = document.querySelector('.breed-select');
const catInfo = document.querySelector('.cat-info');
const catImage = document.getElementById('cat-image');
const catName = document.getElementById('cat-name');
const catDescription = document.getElementById('cat-description');
const catTemperament = document.getElementById('cat-temperament');

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError() {
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showCatInfo() {
    catInfo.classList.remove('hidden');
}

function hideCatInfo() {
    catInfo.classList.add('hidden');
}

function showBreedSelect() {
    breedSelect.classList.remove('hidden');
}

function hideBreedSelect() {
    breedSelect.classList.add('hidden');
}

function fetchBreeds() {
    showLoader();
    hideError();
    hideBreedSelect();
    axios.get('https://api.thecatapi.com/v1/breeds123')
        .then(response => {
            const breeds = response.data;
            breeds.forEach(breed => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                breedSelect.appendChild(option);
            });
            new SlimSelect({
                select: '.breed-select'
            });
            showBreedSelect();
        })
        .catch(error => {
            showError();
            Notiflix.Notify.failure('Error fetching breeds. Please try again later.');
            console.error('Error fetching breeds:', error);
        })
        .finally(() => {
            hideLoader();
        });
}

function fetchCatByBreed(breedId) {
    showLoader();
    hideError();
    hideCatInfo();
    axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
        .then(response => {
            const catData = response.data[0];
            catImage.src = catData.url;
            const breed = catData.breeds[0];
            catName.textContent = breed.name;
            catDescription.textContent = breed.description;
            catTemperament.textContent = breed.temperament;
            showCatInfo();
        })
        .catch(error => {
            showError();
            Notiflix.Notify.failure('Error fetching cat information. Please try again later.');
            console.error('Error fetching cat by breed:', error);
        })
        .finally(() => {
            hideLoader();
        });
}

breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;
    fetchCatByBreed(selectedBreedId);
});

// Fetch breeds when the page loads
fetchBreeds();
