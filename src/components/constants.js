'use strict'

const formTemplate = document.querySelector('template').content.firstElementChild;
const postTemplate = document.querySelector('template').content.lastElementChild;
const postsList = document.querySelector('#posts-list');

export {
    formTemplate,
    postTemplate,
    postsList
};
