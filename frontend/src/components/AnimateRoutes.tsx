import { useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion";
import { Routes, Route, Navigate } from "react-router-dom";
import { PageWrapper } from "./PageWrapper";
import { Home } from "./Home";
import { useAuth } from "./AuthContext";
import { CodeCanvas } from "./CodeCanvas";
import type { AnimateRoutesType } from "@/utils/types";

export const AnimateRoutes = ({socket, user, users}: AnimateRoutesType) => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>

            <Route path="/" element={
              <PageWrapper>
                <Home socket={socket} />
              </PageWrapper>
              } />

            <Route path="/code/:roomid" element={
              <PageWrapper>
                <AuthenticatedRoute>
                  <CodeCanvas users={users} user={user!} socket={socket} />
                </AuthenticatedRoute>
              </PageWrapper>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
    )
}

function AuthenticatedRoute({children}: any) {
    const authContext = useAuth();
    if (authContext.isAuthenticated) {
        return children;
    }
  
    return <Navigate to="/" />
  }
  