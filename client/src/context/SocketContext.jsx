import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import {createContext, useContext, useEffect, useRef} from "react";
import {io} from "socket.io-client"

const SocketContext = createContext(null);

export const useSocket=()=>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children})=>{
    const socket=useRef();
    const {userInfo} = useAppStore();

    useEffect(()=>{
        if(userInfo){
            socket.current=io(HOST, {
                withCredentials:true,
                query: {userId: userInfo.id},   
                // Sends the userId as a query parameter during the handshake, which the server uses to map the socket to the user.
            })
            socket.current.on("connect",()=>{
                console.log("Connected to socket server");
            })

            const handleReceiveMessage= (message) =>{
                const {selectedChatData, selectedChatType, addMessage} = useAppStore.getState();
                if(selectedChatType!==undefined && 
                    (selectedChatData._id===message.sender._id || selectedChatData._id===message.recipient._id)){
                        console.log("msg rcvd", message)
                        addMessage(message);
                }
            }
            socket.current.on("receiveMessage", handleReceiveMessage);

            return ()=>{
                if (socket.current) {
                    socket.current.disconnect();
                    console.log("Disconnected from socket server");
                }
            }
        }
    }, [userInfo]);

    return (
        // Makes the socket instance available to all child components wrapped by SocketProvider
        <SocketContext.Provider value={socket.current}>
        {children}
        </SocketContext.Provider>
    );
}