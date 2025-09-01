import axios from "axios";
import type { Language , LanguageVersionMap } from "./types";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language: Language, sourceCode: string, versions: LanguageVersionMap) => {

    const response = await API.post("/execute", {
        "language": language,
        "version": versions[language],
        "files": [
            {
                "content": sourceCode
            }
        ],
    })

    return response.data;
}

export const getLanguages = async () => {
    const response = await API.get('/runtimes');
    return response.data;
}