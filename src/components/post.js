import constants from "./constants";

// Helper fn to generate a new post by template

const createPost = () => {
    const post = constants.postTemplate.cloneNode(true);
    const postTitle = post.querySelector('h2');
    const postText = post.querySelector('p');
    const creatingTime = post.querySelector('.post-create-time');

    return [post, postTitle, postText, creatingTime];
};

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

const onUpdateButtonClick = () => {
    console.log(1);
}

const renderPost = (title, text) => {
    const [post, postTitle, postText, creatingTime] = createPost();

    postTitle.textContent = title;
    postText.textContent = text;
    creatingTime.textContent = `Создан ${getCurrentTimeString()}`
    post.querySelector('button').addEventListener('click', onUpdateButtonClick);

    constants.postsList.prepend(post);
};

const post = {
    renderPost,
};

export default post;