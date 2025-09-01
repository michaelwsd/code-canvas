import { useEffect, useState } from "react";
import { Box, Button, Heading, Input, VStack, Text, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { uniqueId } from "tldraw";
import type { HomeProps, userDataType } from "@/utils/types";
import { toaster } from "./ui/toaster";
import { useAuth } from "./AuthContext";

export const Home = ({socket}: HomeProps) => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.setAuthenticated(false);
  }, [])

  const generateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setGenLoading(true);

    const roomData: userDataType = {
      username: username || "guest",
      roomId: uniqueId(),
      userId: uniqueId(),
    }
    
    if (!socket.connected) {
      socket.connect()
    }

    auth.setAuthenticated(true);
    socket.emit("userJoined", roomData);
    setTimeout(() => {
      navigate(`/code/${roomData.roomId}`);
      setGenLoading(false);
    }, 800);

  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId) {
      toaster.create({
        description: "Please enter the room code",
        type: "warning",
        closable: true,
      })

      return;
    }

    setJoinLoading(true);
    
    const roomData: userDataType = {
      username: username || "guest",
      roomId: roomId,
      userId: uniqueId(),
    }

    if (!socket.connected) {
      socket.connect()
    }

    // check if room exists
    socket.emit("validateRoom", roomId);
    socket.once("roomValidated", (exists) => {

      if (exists) {
        auth.setAuthenticated(true);
        socket.emit("userJoined", roomData);
        setTimeout(() => {
          navigate(`/code/${roomData.roomId}`);
          setJoinLoading(false);
        }, 800);

      } else {
        setTimeout(() => {
          setJoinLoading(false);
          toaster.create({
            description: "Room does not exist",
            type: "error",
            closable: true,
          })
        }, 800);
      }

    })
  };

  return (
    <Box
      width={'100%'}
      height="95vh"
      overflow='hidden'
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, teal.400, purple.500)"
      color="white"
    >
      <VStack
        gap={3}
        p={10}
        borderRadius="3xl"
        bg="whiteAlpha.200"
        backdropFilter="blur(20px)"
        boxShadow="2xl"
        w="lg"
        textAlign="center"
      >
        <Heading size="2xl" fontWeight={'extrabold'}>Code Canvas</Heading>
        <Text fontSize="sm" opacity={0.9} fontWeight={'bold'} fontStyle={'italic'}>
          code and sketch your thoughts in one place
        </Text>

        {/* Join Room */}

        <VStack>
          {/* Join Room Form */}
          <form onSubmit={joinRoom} style={{ width: "100%" }}>
            <HStack display="flex" alignItems="center" justifyContent="center" mb={3}>
              <Input
                placeholder="Name"
                textAlign="center"
                w="50%"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="linear(to-br, teal.400, purple.500)"
                border="none"
                color="white"
                _placeholder={{ color: "gray.500" }}
                autoComplete="off"
                fontWeight={'medium'}
                borderRadius={'2xl'}
              />
              <Input
                placeholder="Room Code"
                w="50%"
                textAlign="center"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                bg="linear(to-br, teal.400, purple.500)"
                border="none"
                color="white"
                _placeholder={{ color: "gray.500" }}
                autoComplete="off"
                fontWeight={'medium'}
                borderRadius={'2xl'}
              />
            </HStack>
            <Button
              colorScheme="teal"
              w="full"
              type="submit"
              size="lg"
              borderRadius="xl"
              loading={joinLoading}
              loadingText='Joining...'
              fontWeight={'bold'}
            >
              Join Room
            </Button>
          </form>

          {/* Generate Room Form */}
          <form onSubmit={generateRoom} style={{ width: "100%" }}>
            <Button
              colorScheme="purple"
              w="full"
              type="submit"
              size="lg"
              borderRadius="xl"
              loading={genLoading}
              loadingText='Generating...'
              fontWeight={'bold'}
            >
              Generate Room
            </Button>
          </form>
        </VStack>
      </VStack>
    </Box>
  );
};
