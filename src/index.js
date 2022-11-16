import './styles/main.scss';
import renderForm from './components/renderForm';
import post from './components/post';

const container = document.getElementById('container');

renderForm(container, 'creating');
post.renderPost('Hello', 'my New Post');

