import galleryImagesTpl from '../templates/gallery_image.hbs';
import ImageApiServise from './api-servise';
import refs from './refs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';


defaults.delay = 2000;

const imageApiService = new ImageApiServise();
const observer = new IntersectionObserver(onEntry, self);

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onImageclick);


function onImageclick(e) {
    e.preventDefault();
    
    if (e.target.nodeName !== 'IMG') {
        return;
    }
    const largeImage = e.target.dataset.source;
    // console.log(largeImage);
    const instance = basicLightbox.create(`<img src="${largeImage}" alt="image"  />`);

    instance.show();
}
    
function onSearch(e) {
    e.preventDefault();
    imageApiService.query = e.currentTarget.elements.query.value;

    if (imageApiService.query === '') {

        clearImageMarkup();
      
        return error({
            title: "Error",
            text: "Please enter query!"
        });
    }
    
    imageApiService.resetPage();
    observer.unobserve(refs.sentinel);
    clearImageMarkup();
    fetchData();
    observer.observe(refs.sentinel);
}

async function fetchData() {

    try {
        const { hits } = await imageApiService.fetchImage();
       
          if (hits.length === 0) {
            
            clearImageMarkup();

            return error({
              
                title: "Error",
                text: "Image not found! Repeat query!"
        });
    }
        appendImagesMarkup(hits);
  
    } catch (error) {
        console.log('ошибка в fetchData', error);
    }
    
    imageApiService.incrementPage();
}

function appendImagesMarkup(hits) {
    
    refs.gallery.insertAdjacentHTML('beforeend', galleryImagesTpl(hits));
}

function clearImageMarkup() {
    refs.gallery.innerHTML = '';
}

function onEntry(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && imageApiService.query !== '') {
            fetchData();
        }
    });
}

// const targets = document.querySelectorAll('img');

// const lazyLoad = target => {
//   const io = new IntersectionObserver((entries, observer) => {
//     console.log(entries)
//     entries.forEach(entry => {
//       console.log('😍');

//       if (entry.isIntersecting) {
//         const img = entry.target;
//         const src = img.getAttribute('data-lazy');
// console.log(img);
//         img.setAttribute('src', src);
        

//         observer.disconnect();
//       }
//     });
//   });

//   io.observe(target)
// };

// targets.forEach(lazyLoad);



