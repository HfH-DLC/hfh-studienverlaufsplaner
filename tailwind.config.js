module.exports = {
    content: ["./resources/**/*.vue"],

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
