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
                "thunderbird-red": "var(--c-thunderbird-red)",
                "thunderbird-red-light": "var(--c-thunderbird-red-light)",
                "fantasy-dark": "var(--c-fantasy-dark)",
                "fantasy-pastel": "var(--c-fantasy-pastel)",
                "fantasy-plain": "var(--c-fantasy-plain)",
                "fantasy-light": "var(--c-fantasy-light)",
                "hfh-turqoise": "var(--c-turqoise)",
                "hfh-gray-darkest": "var(--c-gray-darkest)",
                "hfh-gray": "var(--c-gray-dark)",
                "hfh-gray-medium":
                    "color-mix(in srgb, var(--c-gray-dark) 60%, white);",
                "hfh-gray-light": "var(--c-gray-light)",
                "hfh-green": "var(--c-green)",
                "hfh-green-medium":
                    "color-mix(in srgb, var(--c-green) 60%, white);",
                "hfh-green-light":
                    "color-mix(in srgb, var(--c-green) 10%, white);",
            },
            maxWidth: {
                container: "var(--w-container)",
                content: "var(--w-content)",
            },
        },
    },
};
