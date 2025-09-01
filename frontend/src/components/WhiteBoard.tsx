import { Box } from "@chakra-ui/react";
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useSyncDemo } from '@tldraw/sync'
import type { WhiteboardProps } from "@/utils/types";

export const WhiteBoard = ({roomId}: WhiteboardProps) => {
  const store = useSyncDemo({ roomId: roomId })
    return (
      <Box
          height="80vh"
          width="100%"
          p={2}
          border="1px solid"
          borderRadius="md"
          bg="white"
      >
          <Tldraw store={store}  />
      </Box>
    );
  };