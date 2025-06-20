import gold from "../../assets/gold_medal.png";
import silver from "../../assets/silver_medal.png";
import bronze from "../../assets/bronze_medal.png";
import terrible from "../../assets/terrible.png";

export const getMedalInfo = (percent: number) => {
    if (percent === 0) {
        return {
            medal: terrible,
            message: "...",
            glowColor: "#cd7f32",
        };
    }
    if (percent >= 80) {
        return {
            medal: gold,
            message: "Super !",
            glowColor: "#ffd700",
        };
    }
    if (percent >= 60) {
        return {
            medal: silver,
            message: "Bien !",
            glowColor: "#c0c0c0",
        };
    }
    return {
        medal: bronze,
        message: "Continue comme ça !",
        glowColor: "#cd7f32",
    };
};