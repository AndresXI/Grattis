module.exports = {
    "extends": "airbnb",
    "parser": 'babel-eslint',
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-one-expression-per-line": "off",
        "eslint(prefer-const)": false
    },
    "globals": {
        "document": 1
    }
};