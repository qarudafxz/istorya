import React from "react";
import {
	Avatar,
	useChatContext,
	Channel,
	UserResponse,
} from "stream-chat-react";

interface ITeamChannelPreviewProps {
	channel?: Channel;
	error?: boolean;
	loading?: boolean;
	type?: string;
}

const TeamChannelPreview: React.FC<ITeamChannelPreviewProps> = ({
	channel,
	type,
}) => {
	const { channel: activeChannel, client } = useChatContext();

	const ChannelPreview: React.FC = () => {
		return (
			<p className='channel-preview__item'>
				💬 {(channel?.data?.name as string) || (channel?.data?.id as string)}
			</p>
		);
	};

	const DirectPreview: React.FC = () => {
		const members: UserResponse[] = Object.values(
			channel?.state?.members || {}
		).filter((member) => member.user?.id !== client.userID);

		return (
			<div className='channel-preview__item single'>
				<Avatar
					image={members[0]?.user?.image as string}
					name={members[0]?.user?.fullName as string}
					size={24}
				/>
				<p>{members[0]?.user?.fullName}</p>
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
				console.log(channel);
			}}>
			{type === "team" ? <ChannelPreview /> : <DirectPreview />}
		</div>
	);
};

export default TeamChannelPreview;
