import React from "react";
import { Avatar, useChatContext, Channel } from "stream-chat-react";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";
import logo from "../assets/pink_icon_logo.png";
import { UserResponse } from "stream-chat";

interface ITeamChannelPreviewProps {
	channel?: typeof Channel;
	error?: boolean;
	loading?: boolean;
	type?: string;

	setToggleContainer: React.Dispatch<React.SetStateAction<boolean>> | undefined;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
	setActiveChannel: React.Dispatch<
		React.SetStateAction<typeof Channel | undefined>
	>;
}

const TeamChannelPreview: React.FC<ITeamChannelPreviewProps> = ({
	channel,
	type,
	setActiveChannel,
	setIsCreating,
	setIsEditing,
	setToggleContainer,
}) => {
	const { channel: activeChannel, client } =
		useChatContext<DefaultStreamChatGenerics>();

	const ChannelPreview: React.FC = () => {
		return (
			<p className='channel-preview__item flex items-center gap-2'>
				<img
					src={logo}
					className='w-5'
				/>
				{(channel?.data?.name as string) || (channel?.data?.id as string)}
			</p>
		);
	};

	const DirectPreview: React.FC = () => {
		const members: UserResponse[] | unknown = Object.values(
			channel?.state?.members || {}
		).filter((member) => member?.user?.id !== client.userID);

		return (
			<div className='channel-preview__item single'>
				<Avatar
					image={members[0]?.user?.image}
					name={members[0]?.user?.fullName}
					size={24}
				/>
				<p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
			</div>
		);
	};
	return (
		<div
			className={
				channel?.id === activeChannel?.id
					? "channel-preview__wrapper__selected"
					: "channel-preview__wrapper"
			}
			onClick={() => {
				setIsCreating!(false);
				setIsEditing!(false);
				setActiveChannel(channel);
				if (setToggleContainer) {
					setToggleContainer((prevState) => !prevState);
				}
			}}>
			{type === "team" ? <ChannelPreview /> : <DirectPreview />}
		</div>
	);
};

export default TeamChannelPreview;
