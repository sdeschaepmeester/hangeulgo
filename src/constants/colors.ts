// Color palette definition
const colors = {
    // Blue palette
    primary: {
        dark: "#003478", // Active icons and actions buttons blue
        main: "#003478", //! pas la bonne
    },
    // Red palette
    secondary: {
        main: "#FFA500", //! pas la bonne 
        dark: "#C60C30",  // Active icons and actions buttons red
    },
    neutral: {
        main: "#888", // ok: pour icone et label gris clair
        dark: "#595959", // ok: pour icones importantes (home, quiz)
        light: "e0e0e0"// OK TODO
    },
    background: "#f2f2f2", // gris très clair à foutre dans neutral
    surface: "#ffffff",
    text: {
        primary: "#333333",
        secondary: "#555555",
        disabled: "#999999",
    },
    success: "#00cc66", // 1 instance
    error: "#e53935", // OK for error messages and deletion danger button
    warning: "#FFA500", // OK
};

export default colors;
