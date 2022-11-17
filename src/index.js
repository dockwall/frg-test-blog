import './styles/main.scss';
import renderForm from './components/renderForm';
import { renderLocalStoragePost } from './components/post';

const container = document.getElementById('container');

// This function can render either creating posts form (general form) or updating form (in posts)
renderForm(container, 'creating');

// This function checks localStorage, if there are saved posts - they will be rendered first
renderLocalStoragePost();
