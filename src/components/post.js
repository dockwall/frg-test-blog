import constants from "./constants";
import renderForm from "./renderForm";

// Helper fn to get a current time that seems like string

const getCurrentTimeString = () => {
    const d = new Date();

    let currentDate = [
        '0' + d.getDate(),
        '0' + (d.getMonth() + 1),
        '' + d.getFullYear(),
        '0' + d.getHours(),
        '0' + d.getMinutes()
    ].map(component => component.slice(-2));

    return `${currentDate.slice(0, 3).join('.')} в ${currentDate.slice(3).join(':')}`;
}

const onUpdateButtonClick = (e) => {
    e.target.textContent = 'Отменить редактирование';
    renderForm(e.target.parentNode.parentNode);

    e.target.removeEventListener('click', onUpdateButtonClick);
    e.target.addEventListener('click', onCancelButtonClick);
};

const onCancelButtonClick = (e) => {
    e.target.parentNode.parentNode.querySelector('article').remove();

    disableUpdateButton(e.target);
};

const onDeleteButtonClick = (e) => {
    e.target.parentNode.parentNode.remove();
};

const onToggleButtonClick = (e) => {
    changeVisibility(e);
};

const changeVisibility = (e) => {
    const postText = e.target.parentNode.parentNode.querySelector('.post-text');
    const deleteButton = e.target.parentNode.querySelector('.post-delete-button');
    const updateButton = e.target.parentNode.querySelector('.post-update-button');
    const updateForm = e.target.parentNode.parentNode.querySelector('article');

    const newDisplayStyle = (deleteButton.style.display === 'none') ? '' : 'none';

    [postText, deleteButton, updateButton].forEach(element => element.style.display = newDisplayStyle);

    if (updateForm) updateForm.style.display = newDisplayStyle;

    e.target.textContent = (newDisplayStyle === '') ? 'Скрыть пост' : 'Показать пост';
};

const updatePost = function (post, title, text) {
    post.querySelector('.post-title').textContent = title;
    post.querySelector('.post-text').textContent = text;
    post.querySelector('.post-update-time').textContent = `Изменен в ${getCurrentTimeString()}`;
    post.querySelector('article').remove();

    disableUpdateButton(post.querySelector('.post-update-button'));
};

const disableUpdateButton = (button) => {
    button.textContent = 'Редактировать';
    button.removeEventListener('click', onCancelButtonClick);
    button.addEventListener('click', onUpdateButtonClick);
};

// Helper fn to generate a new post by template

const createPost = () => {
    const post = constants.postTemplate.cloneNode(true);
    const postTitle = post.querySelector('h2');
    const postText = post.querySelector('p');
    const creatingTime = post.querySelector('.post-create-time');

    return [post, postTitle, postText, creatingTime];
};

const renderPost = function (title, text) {
    const [post, postTitle, postText, creatingTime] = createPost();

    postTitle.textContent = title;
    postText.textContent = text;
    creatingTime.textContent = `Создан ${getCurrentTimeString()}`
    post.querySelector('.post-update-button').addEventListener('click', onUpdateButtonClick);
    post.querySelector('.post-delete-button').addEventListener('click', onDeleteButtonClick);
    post.querySelector('.post-toggle-visibility-button').addEventListener('click', onToggleButtonClick);

    postText.style.display = 'none';
    post.querySelector('.post-update-button').style.display = 'none'
    post.querySelector('.post-delete-button').style.display = 'none'
    constants.postsList.prepend(post);
};

const post = {
    renderPost,
    updatePost
};

export default post;