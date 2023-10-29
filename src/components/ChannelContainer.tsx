import React from "react";
import { Channel, useChatContext } from "stream-chat-react";

import { ChannelInner, CreateChannel, EditChannel, TeamMessage } from "./";

interface Props {
	isCreating?: boolean;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
	createType: string;
}

const ChannelContainer: React.FC<Props> = ({
	isCreating,
	setIsCreating,
	setIsEditing,
	isEditing,
	createType,
}) => {
	const { channel } = useChatContext();

	if (isCreating) {
		return (
			<div className='channel__container'>
				<CreateChannel
					createType={createType}
					setIsCreating={setIsCreating}
				/>
			</div>
		);

		if (isEditing) {
			return (
				<div className='channel__container'>
					<EditChannel setIsEditing={setIsEditing} />
				</div>
			);
		}
	}

	const EmptyState = () => (
		<div className='channel-empty__container'>
			<p className='channel-empty__first'>
				This is the beginning of your chat history.
			</p>
			<p className='channel-empty__second'>
				Send messages, as well as attachments, links, emojis and more
			</p>
		</div>
	);

	return (
		<div className='channel_container'>
			<Channel
				EmptyStateIndicator={EmptyState}
				Message={(messageProps, idx) => (
					<TeamMessage
						key={idx}
						{...messageProps}
					/>
				)}>
				<ChannelInner setIsEditing={setIsEditing} />
			</Channel>
		</div>
	);
};

export default ChannelContainer;
