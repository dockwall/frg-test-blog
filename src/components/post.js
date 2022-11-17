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
    const currentID = e.target.parentNode.parentNode.id;
    e.target.parentNode.parentNode.remove();
    localStorage.removeItem(currentID);
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

    const currentPostID = post.querySelector('.post').id
    const rawLocalCopy = localStorage.getItem(currentPostID);
    const localCopyObject = JSON.parse(rawLocalCopy);

    localCopyObject.updatingTime = post.querySelector('.post-update-time').textContent;
    localCopyObject.text = text;
    localCopyObject.title = title;

    localStorage.setItem(currentPostID, JSON.stringify(localCopyObject));
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
    const updatingTime = post.querySelector('.post-update-time');
    const updateButton = post.querySelector('.post-update-button');
    const deleteButton = post.querySelector('.post-delete-button');
    const toggleButton = post.querySelector('.post-toggle-visibility-button')

    postText.style.display = 'none';
    updateButton.style.display = 'none';
    deleteButton.style.display = 'none';

    return {
        post,
        postTitle,
        postText,
        creatingTime,
        updatingTime,
        updateButton,
        deleteButton,
        toggleButton
    };
};

const renderPost = function (title, text, isLocalPost = false, createTime, updateTime, id) {
    const {
        post,
        postTitle,
        postText,
        creatingTime,
        updatingTime,
        updateButton,
        deleteButton,
        toggleButton
    } = createPost();

    postTitle.textContent = title;
    postText.textContent = text;
    creatingTime.textContent = (!isLocalPost) ? `Создан ${getCurrentTimeString()}` : createTime;
    updatingTime.textContent = (!isLocalPost) ? '' : updateTime;

    updateButton.addEventListener('click', onUpdateButtonClick);
    deleteButton.addEventListener('click', onDeleteButtonClick);
    toggleButton.addEventListener('click', onToggleButtonClick);

    if (!isLocalPost) {
        const pseudoID = String(Date.now());
        post.id = pseudoID;

        const currentPostData = {
            title: title,
            text: text,
            creatingTime: creatingTime.textContent
        };

        localStorage.setItem(pseudoID, JSON.stringify(currentPostData));
    } else {
        post.id = id;
    }

    constants.postsList.prepend(post);
};

const renderLocalStoragePost = () => {
    const postsID = Object.keys(localStorage);

    postsID.forEach(id => {
        if (document.getElementById(id)) return;

        const { title, text, creatingTime, updatingTime } = JSON.parse(localStorage.getItem(id));
        renderPost(title, text, true, creatingTime, updatingTime, id);
    })

};

const post = {
    renderPost,
    updatePost,
    renderLocalStoragePost
};

export {
    renderPost,
    updatePost,
    renderLocalStoragePost
};