const {Errors} = require("./Errors");

class Form {
    constructor(data) {
        this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }

        this.errors = new Errors();
    }

    data() {
        let formData = new FormData;

        for (let property in this.originalData) {
            if (this[property] === false) {
                formData.append(property, 0);
            } else if (this[property] === true) {
                formData.append(property, 1);
            } else {
                formData.append(property, this[property]);
            }
        }

        if (this._method) {
            formData.append('_method', this._method);
        }

        return formData;
    }

    update(data) {
        this.originalData = data;

        for (let field in data) {
            this[field] = data[field];
        }

        this.errors = new Errors();
    }

    reset() {
        for (let field in this.originalData) {
            this[field] = '';
        }

        this.errors.clear();
    }

    post(url) {
        return this.submit('post', url);
    }

    put(url) {
        this._method = 'PUT'; // fix for formData known bug;
        return this.submit('post', url);
    }

    patch(url) {
        this._method = 'PATCH';
        return this.submit('post', url);
    }

    delete(url) {
        return this.submit('delete', url);
    }

    submit(requestType, url) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, this.data())
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.response.data);

                    reject(error.response.data);
                });
        });
    }

    onFail(errors) {
        this.errors.record(errors.errors);
    }
}

module.exports.Form = Form;
