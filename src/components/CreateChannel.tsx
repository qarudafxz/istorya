/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, ChangeEvent } from "react";
import { useChatContext } from "stream-chat-react";
import { AiOutlineCloseCircle } from "react-icons/ai";

import { UserList } from "./";

interface Props {
	createType?: string;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CloseCreateChannel: React.FC<Props> = ({ setIsCreating }) => {
	return (
		<div className='close-create-channel__container'>
			<div
				className='close-create-channel__icon-inner cursor-pointer'
				onClick={() => {
					setIsCreating!(false);
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

const CreateChannel: React.FC<Props> = ({ createType, setIsCreating }) => {
	const [channelName, setChannelName] = useState("");
	const { client, setActiveChannel } = useChatContext();
	const [selectedUsers, setSelectedUsers] = useState([client.userID || ""]);

	const createChannel = async (e) => {
		e.preventDefault();

		try {
			const newChannel = await client.channel(createType!, channelName, {
				name: channelName,
				members: selectedUsers,
			});

			await newChannel.watch();

			setChannelName("");
			setIsCreating!(false);
			setSelectedUsers([client.userID || ""]);

			setActiveChannel(newChannel);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='create-channel__container'>
			<div className='create-channel__header'>
				<p
					style={{
						color: "#FF60DD",
					}}>
					{createType === "team" ? "Create a new Channer" : "Send a Direct Message"}
				</p>
				<CloseCreateChannel setIsCreating={setIsCreating} />
			</div>
			<div
				className='channel-name-input__wrapper'
				style={{
					height: "100%",
				}}>
				{createType === "team" && (
					<div className=''>
						<p>Name</p>
						<input
							value={channelName}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setChannelName(e.target.value)
							}
							placeholder='Channel Name'
						/>
						<p>Add Members</p>
					</div>
				)}
				<UserList setSelectedUsers={setSelectedUsers} />
				<div
					className='create-channel__button-wrapper'
					onClick={createChannel}>
					<p>{createType === "team" ? "Create Channel" : "Create Message Group"}</p>
				</div>
			</div>
		</div>
	);
};

export default CreateChannel;
