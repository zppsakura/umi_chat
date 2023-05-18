export default class Model {
    constructor(args) {
        if (typeof args === 'object' && args !== null) {
            Object.keys(args).forEach((key) => {
                this[key] = args[key];
            });
        }
    }
}
