import React, { ReactNode, useState } from "react";
import {
	MessageList,
	MessageInput,
	Thread,
	Window,
	useChannelActionContext,
	Avatar,
	useChannelStateContext,
	useChatContext,
} from "stream-chat-react";

export const GiphyContext = React.createContext({});

interface Props {
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

type User = {
	id: string;
	fullName: string;
	image: string;
	name: string;
	role: string;
};

type Attachment = {
	og_scrape_url: string;
	image_url: string;
	type: string;
	title: string;
	title_link: string;
};

type Message = {
	attachments: Attachment[];
	mentioned_users: User[];
	parent_id: string;
	parent: Message;
	text: string;
};

const ChannelInner: React.FC<Props> = ({ setIsEditing }) => {
	const [giphyState, setGiphyState] = useState(false);
	const { sendMessage } = useChannelActionContext();

	const overrideSubmitHandler = (message: Message) => {
		let updatedMessage = {
			attachments: message.attachments,
			mentioned_users: message.mentioned_users,
			parent_id: message.parent_id,
			parent: message.parent,
			text: message.text,
		};

		console.log(updatedMessage);

		if (giphyState) {
			updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
		}

		if (sendMessage) {
			sendMessage(updatedMessage);
			setGiphyState(false);
		}
	};

	return (
		<GiphyContext.Provider value={{ giphyState, setGiphyState }}>
			<div className='flex w-full'>
				<Window>
					<TeamChannelHeader setIsEditing={setIsEditing} />
					<MessageList />
					<MessageInput overrideSubmitHandler={overrideSubmitHandler} />
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
