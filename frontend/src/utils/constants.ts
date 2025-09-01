import type { Language, LanguageVersionMap } from "./types";
  
export const defaultVersions: LanguageVersionMap = {
    javascript: "",
    typescript: "",
    python: "",
    java: "",
    csharp: "",
    "c++": "",
    rust: "",
    go: "",
    ocaml: ""
};

export const mapApiNameToLanguage = (apiName: string): Language | null => {
    switch (apiName.toLowerCase()) {
        case "javascript": return "javascript";
        case "typescript": return "typescript";
        case "python": return "python";
        case "java": return "java";
        case "c#": return "csharp";
        case "c++": return "c++";
        case "rust": return "rust";
        case "go": return "go";
        case "ocaml": return "ocaml";
        default: return null;
    }
};

export const ACTIVE_COLOR = "blue.400";