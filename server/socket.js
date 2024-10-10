import {Server as SocketIOServer} from "socket.io"
import Message from "./models/MessageModel.js";

const setupSocket = (server)=>{     //binds Socket.IO to your existing HTTP server.
    const io=new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,     //which origins are allowed to connect
            methods: ["GET","POST"],
            credentials: true,
        }
    })

    const userSocketMap= new Map(); 
    // mapping between userId and socket.id for identifying which socket belongs to which user

    const disconnect = (socket)=>{
        console.log(`client disconnected : ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
            userSocketMap.delete(userId);
            break;
            }
        }
    }
    const sendMessage = async (message)=>{
        const senderSocketId= userSocketMap.get(message.sender);
        const recipientSocketId= userSocketMap.get(message.recipient);

        
            const createdMessage = await Message.create(message);
            console.log("Message created:", createdMessage);
            // Continue with emitting messages...
       

        const messageData=await Message.findById(createdMessage._id)
                            .populate("sender","id email firstName lastName image")
                            .populate("recipient","id email firstName lastName image");
        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }

    }

    io.on("connection", (socket)=>{
        const userId=socket.handshake.query.userId;
        // Extracts the userId from the query parameters sent during the Socket.IO connection handshake
        if(userId){
            userSocketMap.set(userId, socket.id);
            console.log(`user connected: ${userId} with socketID: ${socket.id}`);
        }
        else{
            console.log("User id not provided");
        }

        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", ()=> disconnect(socket));
    })
}
export default setupSocket;