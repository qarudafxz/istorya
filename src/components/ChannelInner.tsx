import React, { useCallback, useEffect, useState } from "react";
import {
	MessageList,
	MessageInput,
	Thread,
	Window,
	useChannelActionContext,
	Avatar,
	useChannelStateContext,
	MessageToSend,
} from "stream-chat-react";
import { logChatPromiseExecution } from "stream-chat";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";
import { IoMdSettings } from "react-icons/io";
import bg from "../assets/bg.svg";
import { RiGroup2Fill } from "react-icons/ri";

export const GiphyContext = React.createContext({});

interface Props {
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
}

const ShowMembersOfTeam = () => {
	const { channel } = useChannelStateContext();
	const members = Object.values(channel.state.members);

	return (
		<>
			{channel?.type === "team" && (
				<div className='border-l border-zinc-800 h-full bg-[#121212]'>
					<div className='flex flex-col gap-4'>
						<p className='font-main font-bold text-primary p-5 bg-[#060606]'>
							Group Members
						</p>
						<div className='flex flex-col gap-5 p-4'>
							{channel?.type === "team" &&
								members?.map((user, i) => (
									<div
										key={i}
										className='team-channel-header__name-multi'>
										{user?.user?.online ? (
											<div className='bg-[#02B01F] rounded-full w-[14px] h-[14px] relative bottom-3 left-9 border-2 border-[#1a1a1a]' />
										) : (
											<div className='bg-zinc-600 rounded-full w-[14px] h-[14px] relative bottom-3 left-9 border-2 border-[#1a1a1a]' />
										)}
										<Avatar
											image={user?.user?.image || user?.user_id}
											name={user?.user?.name || user?.user_id}
											size={35}
										/>
										<p className='font-main text-zinc-400'>{user?.user?.name}</p>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const ChannelInner: React.FC<Props> = ({ isEditing, setIsEditing }) => {
	const { channel } = useChannelStateContext();
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
							// eslint-disable-next-line no-mixed-spaces-and-tabs
					  }
					: undefined,
			};

			const sendMessagePromise = sendMessage(messageToSend);
			logChatPromiseExecution(sendMessagePromise, "send message");
		}

		setGiphyState(false);
	};

	return (
		<div
			className={`${
				channel?.type === "team" ? "grid grid-cols-9" : ""
			} w-full max-h-screen`}
			style={{
				height: "100vh",
			}}>
			<div className={`${channel?.type === "team" && "col-span-7"}`}>
				<GiphyContext.Provider value={{ giphyState, setGiphyState }}>
					<div
						className='flex w-full h-screen'
						style={{
							backgroundColor: "#1A1A1A",
						}}>
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
			</div>
			{channel?.type === "team" && (
				<div className='xxxs:hidden md:block col-span-2'>
					<ShowMembersOfTeam />
				</div>
			)}
		</div>
	);
};

const TeamChannelHeader: React.FC<Props> = ({ setIsEditing, isEditing }) => {
	const { channel, watcher_count } = useChannelStateContext();

	const MessagingHeader = () => {
		const members = Object.values(channel.state.members);

		const additionalMembers = members.length - 3;

		if (channel?.type === "messaging" || channel?.type === "team") {
			return (
				<div
					className='team-channel-header__name-wrapper'
					style={{
						backgroundImage: `url(${bg})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center",
					}}>
					{channel?.type === "team" && (
						<p className='font-main text-2xl font-bold mr-8 text-primary flex items-center gap-2'>
							<RiGroup2Fill
								size={25}
								className='text-primary'
							/>
							{channel?.data?.name}
						</p>
					)}
					{channel?.type === "team" && (
						<span
							style={{ display: "flex" }}
							onClick={() => setIsEditing(!isEditing)}>
							<IoMdSettings
								size={15}
								className='text-zinc-400 cursor-pointer mr-4'
							/>
						</span>
					)}

					{channel?.type === "team" &&
						members?.map((user, i) => (
							<div
								key={i}
								className='team-channel-header__name-multi'>
								<Avatar
									image={user?.user?.image || user?.user_id}
									name={user?.user?.name || user?.user_id}
									size={35}
								/>
							</div>
						))}
					{channel?.type === "messaging" && (
						<div className='team-channel-header__name-multi'>
							<Avatar
								image={members[1]?.user?.image || members[1]?.user_id}
								name={(members[1]?.user?.name as string) || members[1]?.user_id}
								size={35}
							/>
						</div>
					)}
					{channel?.type === "messaging" && (
						<p className='font-main text-zinc-300 mr-2 font-semibold'>
							{members[1].user?.name || members[1]?.user_id}
						</p>
					)}
					{additionalMembers > 0 && (
						<p className='team-channel-header__name user'>
							and {additionalMembers} more
						</p>
					)}
				</div>
			);
		}
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
