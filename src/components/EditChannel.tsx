import React, { ChangeEvent, useState } from "react";
import { useChatContext } from "stream-chat-react";

import { UserList } from "./";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface Props {
	channelName?: string;
	setChannelName?: React.Dispatch<React.SetStateAction<string>>;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedUsers?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CloseCreateChannel: React.FC<Props> = ({ setIsEditing }) => {
	return (
		<div className='close-create-channel__container'>
			<div
				className='close-create-channel__icon-inner cursor-pointer'
				onClick={() => {
					setIsEditing!(false);
				}}>
				<p className='close-create-channel__icon'>
					<AiOutlineCloseCircle
						size={30}
						className='text-primary'
					/>
				</p>
			</div>
		</div>
	);
};

const EditChannel: React.FC<Props> = ({ setIsEditing }) => {
	const { channel } = useChatContext();
	const [channelName, setChannelName] = useState(channel?.data?.name);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const updateChannel = async (e) => {
		e.preventDefault();

		const newName = channelName !== (channel?.data?.name || channel?.data?.id);

		if (newName) {
			await channel?.update(
				{ name: channelName },
				{ text: `Channel name changed to ${channelName}` }
			);
		}

		if (selectedUsers.length) {
			await channel?.addMembers(selectedUsers);
		}

		setChannelName("");
		setIsEditing!(false);
		setSelectedUsers([]);
	};
	return (
		<div className='edit-channel__container'>
			<div className='edit-channel__header'>
				<p>Edit Channel</p>
				<CloseCreateChannel setIsEditing={setIsEditing} />
			</div>
			<div
				className='channel-name-input__wrapper'
				style={{
					height: "100%",
				}}>
				<p>Name</p>
				<input
					value={channelName}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setChannelName(e.target.value)
					}
					placeholder='Channel Name'
				/>
				<p>Add Members</p>
				<UserList setSelectedUsers={setSelectedUsers} />
				<div className='edit-channel__button-wrapper'>
					<p onClick={() => setIsEditing!(false)}>Cancel</p>
					<p onClick={updateChannel}>Save Changes</p>
				</div>
			</div>
		</div>
	);
};

export default EditChannel;
