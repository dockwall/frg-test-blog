// This helper gets a current time that seems like string "YY:MM:DD в HH:MM"
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
};


// This helper recursively searches current post DOM node and returns it
const getCurrentPostFromChild = (e) => {
    let currentPost = e.target;

    while (currentPost.className !== 'post') {
        currentPost = currentPost.parentNode
    };

    return currentPost;
};

export {
    getCurrentTimeString,
    getCurrentPostFromChild
};


