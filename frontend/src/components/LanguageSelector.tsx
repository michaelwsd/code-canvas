import type { Language, LanguageSelectorProps } from "@/utils/types";
import { Box, Menu, Text, Button, Portal } from "@chakra-ui/react"
import { ACTIVE_COLOR } from "@/utils/constants";

export const LanguageSelector = ({language, onSelect, versions}: LanguageSelectorProps) => {
    const languages = Object.entries(versions) as [Language, string][];
    
    return (
        <Box>
            <Menu.Root>
            <Menu.Trigger asChild>
            <Button
                variant="outline"
                size="sm"
                w='100px'
                borderColor='gray.500'
                _hover={{
                    bg: "gray.800",
                    borderColor: "gray.400" ,
                }}
                _focus={{ boxShadow: "none", outline: "none" }}
                mb={3}
            >
                {language}
            </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                <Menu.Content bg='#110c1b' >
                    {languages.map(([lang, version]) => (
                        <Menu.Item value={lang}
                        color={
                            lang === language ? ACTIVE_COLOR : ""
                        } 
                        bg={
                            lang === language ? "gray.900" : "transparent"
                        }
                        _hover={{
                            color: ACTIVE_COLOR,
                            bg: "gray.900",
                            cursor: "pointer"
                        }}
                        onClick={() => onSelect(lang)}>
                        {lang}
                        &nbsp;
                        <Text as='span' color='gray.500' fontSize='sm'>
                            {version}
                        </Text>
                        </Menu.Item>
                    ))}
                </Menu.Content>
                </Menu.Positioner>
            </Portal>
            </Menu.Root>

        </Box>
    )
}