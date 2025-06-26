// Color palette definition
const colors = {
    // Blue palette
    primary: {
        dark: "#003478", // Active icons and actions buttons blue
        main: "#9da7ff", // Pour la navbar
        light: "#c6cbf6", // Pour les squared boutons
        lighter: "#e5e8ff" // scores view
    },
    // Red palette
    secondary: {
        dark: "#C60C30",  // Active icons and actions buttons red
        main: "#ff9d9d", //! pas la bonne 
        light: "#f6c6c6", //! pas la bonne 
        lighter: "#f9d9d9", // not used
        lightest: "#f9f9f9"
    },
    danger: {
        dark: "#a10221",
        main: "#e53935",
        light: "#da637a",
        lighter: "#feb2b2",
        lightest: "#ffc7c7"
    },
    warning: {
        dark: "#a15402",
        main: "#d96402",
        light: "#da9963",
        lighter: "#f57c00",
        lightest: "#ffb66c"
    },
    success: {
        dark: "#0ea102",
        main: "#4dcc25",
        light: "#7ee8a9",
        lighter: "#c6f6d5"
    },
    neutral: {
        darker: "#333",
        dark: "#595959", // ok: pour icones importantes (home, quiz)
        main: "#888", // ok: pour icone et label gris clair
        light: "#c5c5c5",// OK TODO
        lighter: "#e0e0e0",// OK TODO
        lightest: "#f0f0f0",
        white: "#fff",
        black: "#000"
    },
    background: "#f2f2f2", // gris très clair à foutre dans neutral
    surface: "#fff",
    text: {
        primary: "#333333",
        secondary: "#555555",
        disabled: "#999999",
    },
    error: "#e53935", // OK for error messages and deletion danger button
};

export default colors;
