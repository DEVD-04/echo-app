import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ContactList = ({ contacts }) => {
  const { selectedChatType, selectedChatData, setSelectedChatType, setSelectedChatData, setSelectedChatMessages } = useAppStore();

  const handleClick = (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      // When a contact is already selected and another is clicked, clear previous messages
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f1]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {/* Avatar */}
            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
              {contact.image ? (
                <AvatarImage
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-10 w-10 text-lg text-white border-[1px] flex items-center justify-center rounded-full">
                  {contact?.firstName
                    ? contact.firstName.charAt(0) // Get the first letter of the first name
                    : contact?.email
                    ? contact.email.charAt(0) // Get the first letter of the email if no first name
                    : "?"} {/* Fallback to "?" if neither are available */}
                </div>
              )}
            </Avatar>

            {/* Name */}
            <span className="font-semibold">
              {`${contact.firstName || ""} ${contact.lastName || ""}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
