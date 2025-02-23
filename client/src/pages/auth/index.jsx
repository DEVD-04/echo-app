import { useState } from "react";
// import Background from "../../assets/login.jpeg"
import Victory from "../../assets/victory.svg"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Button } from "@/components/ui/button.jsx";
import {toast} from "sonner";
import {apiClient} from "@/lib/api-client.js";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/utils/constants.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate=useNavigate();
  const {setUserInfo} =useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup =()=>{
    if (!email.length){
      toast.error("Email is required");
      return false;
    }
    if (!password.length){
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword){
      toast.error("confirm Password does not match with password");
      return false;
    }
    return true;
  }

  const validateLogin =()=>{
    if (!email.length){
      toast.error("Email is required");
      return false;
    }
    if (!password.length){
      toast.error("Password is required");
      return false;
    }
    return true;
  }


  const handleLogin = async()=>{
    if(validateLogin()){
      const response = await apiClient.post(LOGIN_ROUTES, {email,password},
        {withCredentials: true}
      );
      if(response.data.user.id){
        setUserInfo(response.data.user);
        if(response.data.user.profileSetup){
          navigate("/chat");
        }
        else{
          navigate("/profile");
        }
      }
      console.log({response});
    }
    else {
      console.log("error handlelogin");
    }
  }

  const handleSignup = async()=>{
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTES, {email,password},
        {withCredentials: true}
      );
      if(response.status===201){
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log({response});
    }
    else {
      console.log("error handleSignup");
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">Enter details to get started</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active :bg-transparent text-opacity-90. border-b-2 rounded-none w-full data-[state=active]: text-black data- [state=active]: font-semibold data-[state=active]: border-b-purple-500 p-3 transition-all duration-300 ">
                  Login..
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active :bg-transparent text-opacity-90. border-b-2 rounded-none w-full data-[state=active]: text-black data- [state=active]: font-semibold data-[state=active]: border-b-purple-500 p-3 transition-all duration-300 ">
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input placeholder="Email" type="Email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />

                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <Button className="rounded full p-6" onClick={handleLogin}> Login </Button>
              
              </TabsContent >

              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />

                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />

                <Input placeHolder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <Button className="rounded full p-6" onClick={handleSignup}> Signup </Button>

              </TabsContent>
            </Tabs>
          </div>
        </div>
        
      </div>
    </div >

  );
};

export default Auth;