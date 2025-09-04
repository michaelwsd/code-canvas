import * as monaco from "monaco-editor";
import { Socket } from "socket.io-client";
import type { ReactNode } from "react";

export type Language = 'javascript' 
                     | 'typescript' 
                     | 'python' 
                     | 'java' 
                     | 'csharp' 
                     | 'c++' 
                     | 'rust' 
                     | 'go' 
                     | 'ocaml';

export type LanguageVersionMap = Record<Language, string>;

export interface LanguageAPI {
    language: string
    version: string
}

export interface LanguageSelectorProps {
    language: Language
    onSelect: (language: Language) => void;
    versions: LanguageVersionMap
}  

export interface OutputProps {
    editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
    language: Language
    versions: LanguageVersionMap
    roomId: string
    users: userDataType[]
    user: userDataType
    socket: Socket
}

export interface WhiteboardProps {
    roomId: string
}

export interface HomeProps {
  socket: Socket
}

export interface userDataType {
    username: string
    roomId: string
    userId: string
}

export interface codeRoomType {
    users: userDataType[]
    user: userDataType
    socket: Socket
}

export interface userCardType {
    users: userDataType[]
    user: userDataType
}

export type AuthContextType = {
    isAuthenticated: boolean;
    setAuthenticated: (auth: boolean) => void;
  };

export interface AuthProviderProps {
    children: ReactNode;
  }

export interface AnimateRoutesType {
    users: userDataType[]
    user: userDataType
    socket: Socket
}