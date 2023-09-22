module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true
    },
    extends: [
        'standard',
        'plugin:react/recommended'
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    plugins: [
        'react'
    ],
    rules: {
        indent: [
            'error',
            4 // I use 4 spaces for indentation, change my mind Matti
        ]
    }
}
