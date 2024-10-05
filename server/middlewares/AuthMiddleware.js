import jwt from "jsonwebtoken";

//verify user before getting their data
export const verifyToken = (request, response, next) =>{
    // console.log(request.cookies);
    const token=request.cookies.jwt;
    // console.log({token});
    if(!token) return response.status(401).send("You are not authenticated");
    jwt.verify(token, process.env.JWT_KEY, async(err,payload)=>{
        if(err) return response.status(403).send("Token Invalid");
        request.userId=payload.userId;      // if verification successful put userid in request, we are getting this from token
        next();
    })
}

