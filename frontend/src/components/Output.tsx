import { Box, Button, Text, Stack, IconButton } from "@chakra-ui/react"
import { executeCode } from "@/utils/api";
import { useState } from "react";
import type { OutputProps } from "@/utils/types";
import { FaPencilAlt, FaTimes } from "react-icons/fa"; 
import { UserCard } from "./UserCard";
import { WhiteBoard } from "./WhiteBoard";
import { useNavigate } from "react-router-dom";

export const Output = ({editorRef, language, versions, roomId, users, user, socket}: OutputProps) => {
    const [output, setOutput] = useState<string>("");
    const [runLoading, setRunLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [showWhiteboard, setShowWhiteboard] = useState<boolean>(false);
    const [exitLoading, setExitLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const runCode = async () => {
        setShowWhiteboard(false);
        const sourceCode = editorRef.current?.getValue();
        if (!sourceCode) return;
        try {
            setRunLoading(true);
            const {run: result} = await executeCode(language, sourceCode, versions);
            setOutput(result.output);
            result.stderr ? setIsError(true) : setIsError(false);
        } catch (error: unknown) {
            console.log(error);
        } finally {
            setRunLoading(false);
        }
    }

    const disconnect = () => {
        setExitLoading(true);
        socket.disconnect();
        setTimeout(() => {
            navigate('/');
            setExitLoading(false);    
        }, 600)
    }

    return (
        <Box w='50%'>
            <Text
                mb={3}
                fontSize="lg"   // responsive size
                fontWeight="extrabold"
                letterSpacing="tighter"
                color={'white'}
                fontFamily="'Poppins', sans-serif"
                >
                Output
            </Text>

            <Stack direction="row">
                <Button
                    size="sm"
                    colorScheme='green'
                    w='100px'
                    _hover={{
                        bg: "gray.900",
                        color: "green.200",
                        borderColor: "green.200" ,
                    }}
                    _focus={{ boxShadow: "none", outline: "none" }}
                    mb={3}
                    onClick={runCode}
                    loading={runLoading}
                    loadingText='Running...'
                >
                    Run Code
                </Button>

                <IconButton
                    aria-label="toggle whiteboard"
                    variant="outline"
                    size='sm'
                    onClick={() => setShowWhiteboard(!showWhiteboard)}
                    _hover={{
                        bg: "blue.500",       // background color on hover
                        color: "white",       // icon color on hover
                        transform: "scale(1.1)", // slightly enlarge
                        transition: "all 0.2s ease-in-out", // smooth transition
                      }}
                    >
                    <FaPencilAlt />
                </IconButton>
                
                <UserCard users={users} user={user} />

                <IconButton
                    aria-label="toggle whiteboard"
                    variant="outline"
                    size='sm'
                    _hover={{
                        bg: "red.500",       // background color on hover
                        color: "white",       // icon color on hover
                        transform: "scale(1.1)", // slightly enlarge
                        transition: "all 0.2s ease-in-out", // smooth transition
                      }}
                    onClick={disconnect}
                    loading={exitLoading}
                    loadingText=''
                    >
                    <FaTimes />
                </IconButton>
            </Stack>

            <Box
                height={showWhiteboard ? "0" : "80vh"}
                p={showWhiteboard ? 0 : 4}  // remove padding when collapsed
                border="1px solid"
                borderRadius="md"
                borderColor={isError ? "red.500" : "gray.700"}
                bg="gray.900"
                color={isError ? "red.400" : "white"}
                fontFamily="monospace"
                fontSize="sm"
                overflow="hidden"           // hide content when collapsed
                whiteSpace="pre-wrap"
            >
                {!showWhiteboard && (output ? output : 'Click "Run Code" to see the output.')}
            </Box>

            <Box
                height={showWhiteboard ? "80vh" : "0"}
                overflow="hidden"
                >
                {showWhiteboard && <WhiteBoard roomId={roomId} />}
            </Box>
        </Box>
    )
}