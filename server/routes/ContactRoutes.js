import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getContacts, searchContacts } from "../controllers/ContactsController.js";


const contactsRoutes= Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts", verifyToken, getContacts);

export default contactsRoutes;