import React, { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client.js'
import { GET_USER_INFO } from './utils/constants.js'


const PrivateRoute = ({children})=>{
  const {userInfo}= useAppStore();
  const isAuthenticated = !!userInfo;   //if user is not valid it will be false
  return isAuthenticated ? children : <Navigate to="/auth" />   // if user valid go to required children page, otherwise go to auth page
};

const AuthRoute = ({children})=>{
  const {userInfo}= useAppStore();
  const isAuthenticated = !!userInfo;   //if user is not valid it will be false
  return isAuthenticated ? <Navigate to="/chat" /> : children ; //if user already authenticated, then go to chat page, otherwise go to argument page
};


const App = () => {
  const {userInfo, setUserInfo}=useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const getUserData=async ()=>{
      try{
        const response= await apiClient.get(GET_USER_INFO,
          {withCredentials:true,})
          if(response.status===200 && response.data.id){
            setUserInfo(response.data);
          }
          else{
            setUserInfo(undefined);
          }
          console.log({response});
      }
      catch(error){
        setUserInfo(undefined);
      } finally{
        setLoading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }
    else{
      setLoading(false);
    }
  },[userInfo, setUserInfo]);

  if(loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <Button>Click It</Button> */}
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute>
          <Auth />
        </AuthRoute>} />
        <Route path="/chat" element={
          <PrivateRoute>
          <Chat />
        </PrivateRoute>} />
        <Route path="/profile" element={
          <PrivateRoute>
          <Profile />
        </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth"/>}/>
         </Routes>
         </BrowserRouter>
    </div>
  )
}

export default App
