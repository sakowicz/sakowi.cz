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
        let data = {};

        for (let property in this.originalData) {
            data[property] = this[property];
        }

        return data;
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
        return this.submit('put', url);
    }

    patch(url) {
        return this.submit('patch', url);
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
