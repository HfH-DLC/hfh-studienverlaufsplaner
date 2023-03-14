/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.vue",
    ],

    theme: {
        extend: {
            minHeight: {
                16: "4rem",
            },
            colors: {
                "thunderbird-red": "#be1925",
                "thunderbird-red-light": "#e31826",
            },
            maxWidth: {
                container: "var(--w-container)",
                content: "var(--w-content)",
            },
        },
    },
};
