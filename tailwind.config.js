const colors = require('tailwindcss/colors');

module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                danger: colors.red,
                theme: {
                    50: "#D1F2FF",
                    100: "#A3E5FF",
                    200: "#4DCCFF",
                    300: "#00ACF0",
                    400: "#006A94",
                    500: "#002A3A",
                    600: "#002838",
                    700: "#002533",
                    800: "#00212E",
                    900: "#00212E",
                    950: "#001D29"
                }
                // theme: {
                //     50:  "#0AB1C7",
                //     100: "#0AADC2",
                //     200: "#0897AA",
                //     300: "#078292",
                //     400: "#066370",
                //     500: "#03363D",
                //     600: "#022B31",
                //     700: "#022B31",
                //     800: "#021E22",
                //     900: "#021E22",
                //     950: "#000000"
                // }
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio')
    ],
};
