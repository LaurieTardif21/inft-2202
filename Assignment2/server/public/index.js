// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description of file: index js
import '@fortawesome/fontawesome-free';
import 'bootstrap';
import Navigo from 'navigo';
import './img/bear.jpg';
import './scss/styles.scss';

import FooterComponent from './components/footer/footer';
import HeaderComponent from './components/header/header';
import AboutComponent from './pages/about/about';
import ContactComponent from './pages/contact/contact';
import ListAnimalComponent from './pages/create-animal/create-animal';
import HomeComponent from './pages/home/home';
import CreateAnimalComponent from './pages/list-animals/list-animals';

console.log('Hello World');

export const router = new Navigo('/');

window.addEventListener('load', () =>{
    HeaderComponent();
    FooterComponent();

    router
        .on('/', HomeComponent)
        .on('/', AboutComponent)
        .on('/', ContactComponent)
        .on('/', CreateAnimalComponent)
        .on('/', ListAnimalComponent)
        .resolve();
});

document.addEventListener('click', event => {
    if (event.target.attributes['route']){
        event.preventDefault();
        router.navigate(event.target.attributes['route'].value);
    }
});