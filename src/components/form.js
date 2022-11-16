import constants from "./constants"

const form = constants.formTemplate.cloneNode(true);

const createForm = (parent) => {
    parent.append(form)
}

export default createForm;
