module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            minHeight: {
                '16': '4rem',
            }
        },
    },
    variants: {
        extend: {
            cursor: ['disabled'],
            textColor: ['disabled']
        },
        plugins: [],
    }
}