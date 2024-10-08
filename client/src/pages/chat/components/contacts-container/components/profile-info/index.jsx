import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTES } from "@/utils/constants";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import {IoLogOut, IoPowerSharp} from "react-icons/io5"
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
    const {userInfo, setUserInfo} = useAppStore();
    const navigate=useNavigate();

    const handleLogout = async () =>{
        try{
            const response=await apiClient.post(LOGOUT_ROUTES,{},
                {withCredentials:true,}
            )
            if(response.status===200) {
                navigate("/auth");
                setUserInfo(null);
            }
        }catch(error){
            console.log({error});
        }
    }

    console.log(userInfo);
    return (
        <div className="absolute bottom-9 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt="profile"
                                className="object-cover w-full h-full bg-black"
                            />
                        ) : (
                            <div className="uppercase h-12 w-12 text-lg text-white border-[1px] flex items-center justify-center rounded-full">

                                {userInfo?.firstName
                                    ? userInfo.firstName.split("")[0] // Get the first letter of the first name
                                    : userInfo?.email
                                        ? userInfo.email.split("")[0] // Get the first letter of the email if no first name
                                        : "?" // Default to "?" if neither are available
                                }
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName ?
                        `${userInfo.firstName} ${userInfo.lastName}` : "Unknown"}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 text-xl font-medium" 
                            onClick={()=>navigate("/profile")}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 text-xl font-medium" 
                            onClick={handleLogout}/>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
            
        </div>
    )
}

export default ProfileInfo
