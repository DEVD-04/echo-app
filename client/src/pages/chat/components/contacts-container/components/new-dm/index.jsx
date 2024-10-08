import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import Lottie from "react-lottie"
import { animationDefaultOptions } from "@/lib/utils.js"
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants.js";
import { useAppStore } from "@/store";




const NewDM = () => {
	const {setSelectedChatData,setSelectedChatType}=useAppStore();
	const [openNewContact, setOpenNewContact] = useState(false);
	const [searchedContacts, setSearchedContacts] = useState([]);

	const searchContacts = async (searchTerm) => {
		try {
			if (searchTerm.length > 0) {
				const response = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true });
				if (response.status === 200 && response.data.contacts) {
					setSearchedContacts(response.data.contacts);
				}
			}
			else {
				setSearchedContacts([]);
			}
		} catch (error) {
			console.log({ error })
		}
	}

	const selectNewContact=(contact)=>{		//all info abt this contact will be stored in zustand
		setOpenNewContact(false);
		setSelectedChatType("contact");
		setSelectedChatData(contact);
		setSearchedContacts([]);


	}

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
							onClick={() => setOpenNewContact(true)}
						/>

					</TooltipTrigger>
					<TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white" >
						Select New Contact
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Dialog open={openNewContact} onOpenChange={setOpenNewContact}>
				<DialogContent className="bg-[#181920] border-none text-white w-[400px] flex flex-col" >
					<DialogHeader>
						<DialogTitle>Select a contact</DialogTitle>
						<DialogDescription>
						</DialogDescription>
					</DialogHeader>
					<div>
						<Input placeholder="search contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
							onChange={e => searchContacts(e.target.value)}
						/>
					</div>
					{searchContacts.length>0 && 
					<ScrollArea className="h-[250px]">
						<div className="flex flex-col gap-5">
							{searchedContacts.map((contact) => (
								<div key={contact._id} onClick={()=>selectNewContact(contact)}
								className="flex gap-3 items-center cursor-pointer">
									<div className="w-12 h-12 relative">
										<Avatar className="h-12 w-12 rounded-full overflow-hidden">
											{contact.image ? (
												<AvatarImage
													src={`${HOST}/${contact.image}`}
													alt="profile"
													className="object-cover w-full h-full bg-black"
												/>
											) : (
												<div className="uppercase h-12 w-12 text-lg text-white border-[1px] flex items-center justify-center rounded-full">

													{contact?.firstName
														? contact.firstName.split("")[0] // Get the first letter of the first name
														: contact?.email
															? contact.email.split("")[0] // Get the first letter of the email if no first name
															: "?" // Default to "?" if neither are available
													}
												</div>
											)}
										</Avatar>
									</div>
									<div className="flex flex-col">
                    {contact.firstName && contact.lastName ?
                        `${contact.firstName} ${contact.lastName}` : "No Name"}
										<span className="text-xs">
									{contact.email}
								</span>
								</div>
								
								</div>
							))
							}
						</div>
					</ScrollArea>
}
					{searchedContacts.length <= 0 &&
						(<div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center duration-1000 transition-all">
							<Lottie
								isClickToPauseDisabled={true}
								height={100}
								width={100}
								options={animationDefaultOptions}
							/>
							<div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
								<h3 className="poppins-medium">
									Search Contacts
								</h3>
							</div>
						</div>)}
				</DialogContent>
			</Dialog>


		</>
	)
}

export default NewDM
