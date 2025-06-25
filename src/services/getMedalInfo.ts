import gold from "../../assets/gold_medal.png";
import silver from "../../assets/silver_medal.png";
import bronze from "../../assets/bronze_medal.png";
import terrible from "../../assets/terrible.png";
import i18n from "@/i18n";

export const getMedalInfo = (percent: number) => {
    if (percent === 0) {
        return {
            medal: terrible,
            message: i18n.t("medal.bad"),
            glowColor: "#cd7f32",
        };
    }
    if (percent >= 80) {
        return {
            medal: gold,
            message: i18n.t("medal.gold"),
            glowColor: "#ffd700",
        };
    }
    if (percent >= 60) {
        return {
            medal: silver,
            message: i18n.t("medal.silver"),
            glowColor: "#c0c0c0",
        };
    }
    return {
        medal: bronze,
        message: i18n.t("medal.bronze"),
        glowColor: "#cd7f32",
    };
};