import { postTemplate, postsList } from "./constants";
import { getCurrentTimeString, getCurrentPostFromChild } from "./helpers";
import renderForm from "./renderForm";

// Post events handlers

const onToggleButtonClick = (e) => {
    changeVisibility(e);
};

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
    const currentPost = getCurrentPostFromChild(e);
    const currentID = currentPost.id;

    currentPost.remove();
    localStorage.removeItem(currentID);
};

// This function changes visibility of a current post when toggle button clicked

const changeVisibility = (e) => {
    const currentPost = getCurrentPostFromChild(e);

    const postText = currentPost.querySelector('.post-text');
    const deleteButton = currentPost.querySelector('.post-delete-button');
    const updateButton = currentPost.querySelector('.post-update-button');
    const updateForm = currentPost.querySelector('article');

    const newDisplayStyle = (postText.style.display === 'none') ? '' : 'none';

    [postText, deleteButton, updateButton].forEach(element => element.style.display = newDisplayStyle);

    // Updating form is visible only if user clicked update button
    // If it no exists, forEach throws an error
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
    const post = postTemplate.cloneNode(true);
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

    postsList.prepend(post);
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