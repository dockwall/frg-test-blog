import { formTemplate } from "./constants";
import { renderPost, updatePost } from "./post";

const formConfig = {
    creating: {
        buttonText: 'Отправить пост',
        titleLabel: 'Напишите заголовок поста',
        textLabel: 'Напишите текст поста',

        onSubmit(e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const title = formData.get('post-title');
            const text = formData.get('post-text');

            renderPost(title, text);
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

            const currentPost = e.target.parentNode.parentNode.parentNode;

            updatePost(currentPost, title, text);
        }
    }
};

// Helper fn to generate a new form by template

const createForm = () => {
    const form = formTemplate.cloneNode(true);
    const submitButton = form.querySelector('button');
    const titleLabel = form.querySelector('.form-title-input label');
    const textLabel = form.querySelector('.form-text-input label');

    return [form, submitButton, titleLabel, textLabel];
};

// In render fn: form type represents config - creating or updating

const renderForm = (parent, formType = 'updating') => {
    const [form, submitButton, titleLabel, textLabel] = createForm();

    const currentConfig = formConfig[formType];

    submitButton.textContent = currentConfig.buttonText;
    titleLabel.textContent = currentConfig.titleLabel;
    textLabel.textContent = currentConfig.textLabel;
    form.addEventListener('submit', currentConfig.onSubmit);

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
