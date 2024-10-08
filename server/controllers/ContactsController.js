import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
    try{
        const {searchTerm} = request.body;
        if(searchTerm===undefined || searchTerm===null){
            return response.status(400).send("Search term required");    
        }
        const sanitizedSearchedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchedTerm, "i");        

        const contacts= await User.find({
            $and: [
                { _id: {$ne: request.userId}},  //excluding user itself
                {
                    $or: [{firstName: regex},{lastName:regex},{email:regex}],   //if any matches
                },
            ],
        });

        return response.status(200).json({contacts});    
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};