import { Button } from "@chakra-ui/react";
import { useState } from "react";

export function CopyButton({ roomid }: { roomid: string }) {
    const [copied, setCopied] = useState(false)

    const copyText = async () => {
      try {
        await navigator.clipboard.writeText(roomid);
        setCopied(true)
  
        // reset after 2 seconds
        setTimeout(() => setCopied(false), 800)
      } catch (err) {
        console.error("Failed to copy: ", err)
      }
    }

    return ( 
        <Button
          display="flex"
          borderRadius={'full'}
          h={8}
          justifyContent="center"
          alignItems="center"
          mb={0}
          mt={3}
          onClick={copyText}
          bg={copied ? 'green.600' : 'gray.700'}
          color='white'
          _hover={{
            bg: copied ? "green.600" : "gray.600",
          }}
        >
          {copied ? "Copied!" : roomid}
        </Button>
      )
}
