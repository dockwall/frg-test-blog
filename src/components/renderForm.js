import { formTemplate } from "./constants";
import { renderPost, updatePost } from "./post";
import { getCurrentTimeString, getCurrentPostFromChild } from "./helpers";


// Form config for renderForm function (second argument)
const formConfig = {
    creating: {
        buttonText: 'Отправить пост',
        titleLabel: 'Напишите заголовок поста',
        textLabel: 'Напишите текст поста',

        onSubmit(e) {
            e.preventDefault();

            const formData = new FormData(e.target);

            const postData = {
                title: formData.get('post-title'),
                text: formData.get('post-text'),
                creatingTime: `Создан ${getCurrentTimeString()}`,
                updatingTime: ''
            };

            renderPost(postData);
            e.target.reset();
        }
    },
    updating: {
        buttonText: 'Обновить пост',
        titleLabel: 'Напишите новый заголовок поста',
        textLabel: 'Напишите новый текст поста',

        onSubmit(e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const title = formData.get('post-title');
            const text = formData.get('post-text');

            const currentPost = getCurrentPostFromChild(e);

            updatePost(currentPost, title, text);
        }
    }
};

// Helper to generate a new form by template

const createFormByTemplate = () => {
    const form = formTemplate.cloneNode(true);

    return form;
};

// This function renders creating or updating form (depends on the second argument)

const renderForm = (parent, formType = 'updating') => {
    const form = createFormByTemplate();

    const submitButton = form.querySelector('button');
    const titleLabel = form.querySelector('.form-title-input label');
    const textLabel = form.querySelector('.form-text-input label');

    // Config for current render
    const currentConfig = formConfig[formType];

    submitButton.textContent = currentConfig.buttonText;
    titleLabel.textContent = currentConfig.titleLabel;
    textLabel.textContent = currentConfig.textLabel;
    form.addEventListener('submit', currentConfig.onSubmit);


    // Final customization - styles and form fields first values
    if (formType === 'creating') {
        form.classList.add('creating-form');
        parent.prepend(form);
    } else if (formType === 'updating') {
        form.classList.add('updating-form');

        form.querySelector('.form-title-input input').value = parent.querySelector('.post-title').textContent;
        form.querySelector('.form-text-input textarea').value = parent.querySelector('.post-text').textContent;

        parent.append(form);
    }

};

export default renderForm;
