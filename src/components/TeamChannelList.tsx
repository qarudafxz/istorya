import React from "react";
import { AddChannel } from "../assets/AddChannel";

interface IstroyaChannelListProps {
	children?: React.ReactNode;
	error?: boolean;
	loading?: boolean;
	type?: string;
	isCreating?: boolean;

	setType?: React.Dispatch<React.SetStateAction<string>>;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	setCreateType?: React.Dispatch<React.SetStateAction<string>> | undefined;
	setToggleContainer?: React.Dispatch<React.SetStateAction<boolean>>;
}

const IstroyaChannelList: React.FC<IstroyaChannelListProps> = ({
	children,
	error,
	loading,
	type,
	setIsCreating,
	setIsEditing,
	setCreateType,
	setToggleContainer,
}) => {
	if (error) {
		return type === "team" ? (
			<div className='channel-list__message'>
				<p className='font-main text-center text-primary text-xs p-4'>
					Error loading groups, please try again later
				</p>
			</div>
		) : null;
	}

	if (loading) {
		return (
			<div className='channel-list__message'>
				{type === "team" ? "Groups" : "Messages"} loading...
			</div>
		);
	}
	return (
		<div className='team-channel-list'>
			<div className='team-channel__header'>
				<p className='team-channel-list__header__title flex gap-4 items-center p-4'>
					{type === "team" ? "Group Chats" : "Istorya DMs"}
					<AddChannel
						setIsCreating={setIsCreating}
						setIsEditing={setIsEditing}
						setCreateType={setCreateType}
						type={type}
						setToggleContainer={setToggleContainer}
					/>
				</p>
			</div>
			{children}
		</div>
	);
};

export default IstroyaChannelList;
