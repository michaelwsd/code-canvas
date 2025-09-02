import { Box } from '@chakra-ui/react'
import { CodeCanvas } from './components/CodeCanvas'
import { Home } from './components/Home'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import io from "socket.io-client"
import { useEffect, useState } from 'react'
import { Toaster, toaster } from "@/components/ui/toaster"
import type { userDataType } from './utils/types'
import { Socket } from 'socket.io-client'
import { AuthProvider, useAuth } from './components/AuthContext'

function App() {
  const [user, setUser] = useState<userDataType>();
  const [users, setUsers] = useState<userDataType[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {

    // create the socket once on mount
    // deployed backend server: https://code-canvas-backend-r1z9.onrender.com
    const server = "https://localhost:5000";
    const connectionOptions = {
      "force new connection": true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
      transports: ['websocket']
    }
    const s = io(server, connectionOptions);
    setSocket(s);

    const handleUserIsJoined = (data: any) => {
      if (data.success) {
        setUser(data.user);
        setUsers(data.users);
      } else {
        console.log("error");
      }
    };
  
    const handleAllUsers = (data: userDataType[]) => {
      setUsers(data);
    };
  
    const handleUserJoinedMessage = (data: string) => {
      toaster.create({
        description: `${data} has joined the room`,
        type: "info",
      });
    };

    const handleUserLeftMessage = (data: any) => {
      setUsers(data.users);
      toaster.create({
        description: `${data.user.username} has left the room`,
        type: "info",
      });
    }
  
    s.on("userIsJoined", handleUserIsJoined);
    s.on("allUsers", handleAllUsers);
    s.on("userJoinedMessageBroadcasted", handleUserJoinedMessage);
    s.on("userLeftMessageBroadcasted", handleUserLeftMessage);
    
    // react will mount components twice in dev mode to help detect side effects, need to clean up
    // cleanup function to avoid duplicate listeners
    return () => {
      s.off("userIsJoined", handleUserIsJoined);
      s.off("allUsers", handleAllUsers);
      s.off("userJoinedMessageBroadcasted", handleUserJoinedMessage);
      s.off("userLeftMessageBroadcasted", handleUserLeftMessage);
    };
  }, [])

  if (!socket) return null;

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={5}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home socket={socket} />} />
            <Route path="/code/:roomid" element={
              <AuthenticatedRoute>
                <CodeCanvas users={users} user={user!} socket={socket} />
              </AuthenticatedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </Box>
  )
}

function AuthenticatedRoute({children}: any) {
  const authContext = useAuth();
  if (authContext.isAuthenticated) {
      return children;
  }

  return <Navigate to="/" />
}

export default App
