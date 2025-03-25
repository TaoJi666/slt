import {useState} from "react"
import {useTranslation, Trans} from "react-i18next";

const Home = () => {
    const {t} = useTranslation();

    return (
        <div>
            {t("home")}
        </div>
    )
}

export default Home