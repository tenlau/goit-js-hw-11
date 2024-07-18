import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

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

function loadBreeds() {
    showLoader();
    hideError();
    hideBreedSelect();
    fetchBreeds()
        .then(breeds => {
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
        .catch(() => {
            showError();
            Notiflix.Notify.failure('Error fetching breeds. Please try again later.');
        })
        .finally(() => {
            hideLoader();
        });
}

function loadCatByBreed(breedId) {
    showLoader();
    hideError();
    hideCatInfo();
    fetchCatByBreed(breedId)
        .then(catData => {
            const cat = catData[0];
            catImage.src = cat.url;
            const breed = cat.breeds[0];
            catName.textContent = breed.name;
            catDescription.textContent = breed.description;
            catTemperament.textContent = breed.temperament;
            showCatInfo();
        })
        .catch(() => {
            showError();
            Notiflix.Notify.failure('Error fetching cat information. Please try again later.');
        })
        .finally(() => {
            hideLoader();
        });
}

breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;
    loadCatByBreed(selectedBreedId);
});

// Fetch breeds when the page loads
loadBreeds();
