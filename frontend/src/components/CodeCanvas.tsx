import { Box, Stack, Text } from "@chakra-ui/react"
import { Editor } from "@monaco-editor/react"
import { useEffect, useRef, useState } from "react"
import * as monaco from "monaco-editor";
import { LanguageSelector } from "./LanguageSelector";
import { Output } from "./Output";
import type { Language, LanguageVersionMap, LanguageAPI } from "@/utils/types";
import { defaultVersions, mapApiNameToLanguage } from "@/utils/constants";
import { getLanguages } from "@/utils/api";
import { useParams } from "react-router-dom";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebrtcProvider } from "y-webrtc";
import { CopyButton } from "./CopyButton";
import type { codeRoomType } from "@/utils/types";

export const CodeCanvas = ({users, user, socket}: codeRoomType) => {
    const { roomid } = useParams();
    const [value, setValue] = useState<string>("");
    const [language, setLanguage] = useState<Language>("python");
    const [languageVersions, setLanguageVersions] = useState<LanguageVersionMap>(defaultVersions);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const ydocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebrtcProvider | null>(null);
    
    useEffect(() => {
        const fetchLanguageVersions = async () => {
          try {
            const data: LanguageAPI[] = await getLanguages();
            const versionMap: Partial<Record<Language, string>> = {};

            // Map API names to your editor-friendly keys
            data.forEach(({language, version}) => {
                const langKey = mapApiNameToLanguage(language);
                if (langKey) versionMap[langKey] = version;
            })  
            
            setLanguageVersions(versionMap as LanguageVersionMap);
          } catch (err) {
            console.error("Failed to fetch language versions", err);
          }
        };
    
        fetchLanguageVersions();
      }, []);

      useEffect(() => {
        if (!roomid) return;
        
        // ensure only one ydoc and provider per room
        const ydoc = new Y.Doc();
        const provider = new WebrtcProvider(roomid, ydoc);
    
        ydocRef.current = ydoc;
        providerRef.current = provider;
    
        return () => {
          provider.destroy();
          ydoc.destroy();
          ydocRef.current = null;
          providerRef.current = null;
        };
      }, [roomid]);
    
      const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        editor.focus();
        
        // use the same ydoc and provider for this room
        const ydoc = ydocRef.current;
        const provider = providerRef.current;
    
        if (!ydoc || !provider) return;
    
        const yText = ydoc.getText("monaco");
        const model = editor.getModel();
        if (model) {
          new MonacoBinding(yText, model, new Set([editor]), provider.awareness);
        }
      };

    const onSelect = (language: Language) => {
        setLanguage(language);
    }

    return (
        <Box>
            <Stack direction='row'>
                
                {/* code editor */}
                <Box w='50%'>
                    <Text
                        mb={3}
                        fontSize="lg"   // responsive size
                        fontWeight="extrabold"
                        letterSpacing="tighter"
                        color={'white'}
                        fontFamily="'Poppins', sans-serif"
                    >
                        Language
                    </Text>
                    <LanguageSelector language={language} onSelect={onSelect} versions={languageVersions} />
                    <Editor 
                        height="80vh"
                        theme="vs-dark"
                        language={language}
                        onMount={onMount} 
                        defaultValue={""}
                        value={value}       
                        onChange={(value) => setValue(value ?? "")} 
                    />
                </Box>

                {/* output */}
                <Output editorRef={editorRef} language={language} versions={languageVersions} roomId={roomid!} users={users} user={user} socket={socket} />
            </Stack>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={2}>
                <CopyButton roomid={roomid!}/>
            </Box>
        </Box>
    )
}