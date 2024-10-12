import { useAppStore } from "@/store";
import { RiCloseFill } from "react-icons/ri";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = () => {
	const { closeChat, selectedChatData, selectedChatType } = useAppStore();
	return (
		<div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
			<div className="flex gap-5 items-center w-full justify-between">
				<div className="felx gap-3 items-center justify-center">
					<div className="w-12 h-12 relative">
						<Avatar className="h-12 w-12 rounded-full overflow-hidden">
							{selectedChatData.image ? (
								<AvatarImage
									src={`${HOST}/${selectedChatData.image}`}
									alt="profile"
									className="object-cover w-full h-full bg-black"
								/>
							) : (
								<div className="uppercase h-12 w-12 text-lg text-white border-[1px] flex items-center justify-center rounded-full">

									{selectedChatData?.firstName
										? selectedChatData.firstName.split("")[0] // Get the first letter of the first name
										: selectedChatData?.email
											? selectedChatData.email.split("")[0] // Get the first letter of the email if no first name
											: "Unknown" // Default to "?" if neither are available
									}
								</div>
							)}
						</Avatar>
					</div>
				</div>
				<div>
					{selectedChatType === "contact" && `${selectedChatData.firstName || " "} ${selectedChatData.lastName}`}
				</div>
				<div className="felx gap-5 items-center justify-center">
					<button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
						onClick={closeChat}>
						<RiCloseFill className="text-3xl" />
					</button>

				</div>
			</div>
		</div>
	)
}

export default ChatHeader
