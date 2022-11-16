import constants from "./constants";



// Helper fn to generate a new post by template

const createPost = () => {
    const post = constants.postTemplate.cloneNode(true);
    const postTitle = post.querySelector('h2');
    const postText = post.querySelector('p');
    const creatingTime = post.querySelector('.post-create-time');

    return [post, postTitle, postText, creatingTime];
};

const renderPost = (title, text) => {
    const [post, postTitle, postText, creatingTime] = createPost();
    const d = new Date();
    let currentDate = [
        '0' + d.getDate(),
        '0' + (d.getMonth() + 1),
        '' + d.getFullYear(),
        '0' + d.getHours(),
        '0' + d.getMinutes()
    ].map(component => component.slice(-2))


    postTitle.textContent = title;
    postText.textContent = text;
    creatingTime.textContent = 'Создан ' + currentDate.slice(0, 3).join('.') + ' в ' + currentDate.slice(3).join(':');

    constants.postsList.prepend(post);
};

const post = {
    renderPost,
};

export default post;