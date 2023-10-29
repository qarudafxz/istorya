import React, { useState } from "react";
import {
	MessageList,
	MessageInput,
	Thread,
	Window,
	useChannelActionContext,
	Avatar,
	useChannelStateContext,
	useChatContext,
	MessageToSend,
} from "stream-chat-react";
import { logChatPromiseExecution } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";

export const GiphyContext = React.createContext({});

interface Props {
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
}

const ChannelInner: React.FC<Props> = ({ isEditing, setIsEditing }) => {
	const [giphyState, setGiphyState] = useState(false);
	const { sendMessage } = useChannelActionContext<DefaultStreamChatGenerics>();
	const actions = ["delete", "edit", "flag", "mute", "react", "reply"];

	const overrideSubmitHandler = (
		message: MessageToSend<DefaultStreamChatGenerics>
	) => {
		let updatedMessage;

		if (message.attachments?.length && message.text?.startsWith("/giphy")) {
			const updatedText = message.text.replace("/giphy", "");
			updatedMessage = { ...message, text: updatedText };
		}

		if (giphyState) {
			const updatedText = `/giphy ${message.text}`;
			updatedMessage = { ...message, text: updatedText };
		}

		if (sendMessage) {
			const newMessage = updatedMessage || message;
			const parentMessage = newMessage.parent;

			const messageToSend = {
				...newMessage,
				parent: parentMessage
					? {
							...parentMessage,
							created_at: parentMessage.created_at?.toString(),
							pinned_at: parentMessage.pinned_at?.toString(),
							updated_at: parentMessage.updated_at?.toString(),
					  }
					: undefined,
			};

			const sendMessagePromise = sendMessage(messageToSend);
			logChatPromiseExecution(sendMessagePromise, "send message");
		}

		setGiphyState(false);
	};

	return (
		<GiphyContext.Provider value={{ giphyState, setGiphyState }}>
			<div className='flex w-full'>
				<Window>
					<TeamChannelHeader
						isEditing={isEditing}
						setIsEditing={setIsEditing}
					/>
					<MessageList messageActions={actions} />
					<MessageInput
						focus
						overrideSubmitHandler={overrideSubmitHandler}
					/>
				</Window>
				<Thread />
			</div>
		</GiphyContext.Provider>
	);
};

const TeamChannelHeader: React.FC<Props> = ({ setIsEditing }) => {
	const { channel, watcher_count } = useChannelStateContext();
	const { client } = useChatContext();

	const MessagingHeader = () => {
		const members = Object.values(channel.state.members).filter(
			({ user }) => user?.id !== client._user?.id
		);

		const additionalMembers = members.length - 3;

		if (channel?.type === "messaging" || channel?.type === "team") {
			return (
				<div className='team-channel-header__name-wrapper'>
					<p className='font-main text-2xl font-bold mr-8 text-primary'>
						# {channel?.data?.name}
					</p>
					{members?.map(({ user }, i) => (
						<div
							key={i}
							className='team-channel-header__name-multi'>
							<Avatar
								image={user?.image || client._user?.image}
								name={(user?.fullName as string) || user?.id}
								size={35}
							/>
						</div>
					))}

					{additionalMembers > 0 && (
						<p className='team-channel-header__name user'>
							and {additionalMembers} more
						</p>
					)}
				</div>
			);
		}

		return (
			<div className='team-channel-header__channel-wrapper'>
				<span
					style={{ display: "flex" }}
					onClick={() => setIsEditing(true)}></span>
			</div>
		);
	};

	interface Watchers {
		watchers: number;
	}

	const getWatcherText: React.FC<Watchers> = ({ watchers }) => {
		if (!watchers) return "No users online";
		if (watchers === 1) return "1 user online";
		return `${watchers} users online`;
	};

	return (
		<div className='team-channel-header__container'>
			<MessagingHeader />
			<div className='team-channel-header__right'>
				<p className='team-channel-header__right-text'>
					{getWatcherText({ watchers: watcher_count as number })}
				</p>
			</div>
		</div>
	);
};

export default ChannelInner;
