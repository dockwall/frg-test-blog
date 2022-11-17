import { postTemplate, postsList } from "./constants";
import { getCurrentTimeString, getCurrentPostFromChild } from "./helpers";
import renderForm from "./renderForm";

// Post events handlers

const onToggleButtonClick = (e) => {
    changeVisibility(e);
};

const onUpdateButtonClick = (e) => {
    const currentPost = getCurrentPostFromChild(e);

    e.target.textContent = 'Отменить редактирование';
    renderForm(currentPost);

    e.target.removeEventListener('click', onUpdateButtonClick);
    e.target.addEventListener('click', onCancelButtonClick);
};

const onCancelButtonClick = (e) => {
    const currentPost = getCurrentPostFromChild(e);
    currentPost.querySelector('article').remove();
    disableUpdateButton(e.target);
};

const onDeleteButtonClick = (e) => {
    const currentPost = getCurrentPostFromChild(e);
    const currentPostID = currentPost.id;

    currentPost.remove();
    localStorage.removeItem(currentPostID);
};

// This function disables update button (I used it for cancel or success update)

const disableUpdateButton = (button) => {
    button.textContent = 'Редактировать';
    button.removeEventListener('click', onCancelButtonClick);
    button.addEventListener('click', onUpdateButtonClick);
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

// This function updates current post and saves data in localStorage

const updatePost = function (post, newTitle, newText) {
    const updateTime = post.querySelector('.post-update-time');

    post.querySelector('.post-title').textContent = newTitle;
    post.querySelector('.post-text').textContent = newText;
    post.querySelector('article').remove();
    updateTime.textContent = `Изменен ${getCurrentTimeString()}`;

    const currentUpdateButton = post.querySelector('.post-update-button');
    disableUpdateButton(currentUpdateButton);

    const currentPostID = post.querySelector('.post').id;
    const LocalCopyJSON = localStorage.getItem(currentPostID);
    const localCopyObject = JSON.parse(LocalCopyJSON);

    localCopyObject.updatingTime = updateTime.textContent;
    localCopyObject.text = newText;
    localCopyObject.title = newTitle;

    localStorage.setItem(currentPostID, JSON.stringify(localCopyObject));
};

// This function generates a new post by HTML template

const createPostByTemplate = () => {
    const post = postTemplate.cloneNode(true);

    return post;
};

// This function renders post from local storage

const renderPostFromLocalStorage = () => {
    const postsID = Object.keys(localStorage);

    postsID.forEach(id => {
        const postData = JSON.parse(localStorage.getItem(id));
        postData.id = id;
        renderPost(postData, true);
    });
};

// This function renders post with form data and local storage data (if exists)

const renderPost = function ({ title, text, creatingTime, updatingTime, id }, isLocalPost = false) {
    const post = createPostByTemplate();

    const postTitle = post.querySelector('h2');
    const postText = post.querySelector('p');
    const createTime = post.querySelector('.post-create-time');
    const updateTime = post.querySelector('.post-update-time');
    const updateButton = post.querySelector('.post-update-button');
    const deleteButton = post.querySelector('.post-delete-button');
    const toggleButton = post.querySelector('.post-toggle-visibility-button');

    // Default render styles
    postText.style.display = 'none';
    updateButton.style.display = 'none';
    deleteButton.style.display = 'none';

    // Post content (both first created and updated)
    postTitle.textContent = title;
    postText.textContent = text;
    createTime.textContent = creatingTime;
    updateTime.textContent = updatingTime;

    // Default handlers
    updateButton.addEventListener('click', onUpdateButtonClick);
    deleteButton.addEventListener('click', onDeleteButtonClick);
    toggleButton.addEventListener('click', onToggleButtonClick);

    // *Special* moment about post id - get it from current storage entry, or create
    if (isLocalPost) {
        post.id = id;
    } else {
        const pseudoID = String(Date.now());
        post.id = pseudoID;

        const currentPostData = {
            title: title,
            text: text,
            creatingTime: creatingTime
        };

        localStorage.setItem(pseudoID, JSON.stringify(currentPostData));
    }

    postsList.prepend(post);
};

export {
    renderPost,
    updatePost,
    renderPostFromLocalStorage
};