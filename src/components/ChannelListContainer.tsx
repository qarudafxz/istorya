/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from "./";
import Cookies from "universal-cookie";
import logo from "../assets/pink_icon_logo.png";
import { TbLogout2 } from "react-icons/tb";
import TopLoadingBar from "react-top-loading-bar";

interface Props {
	isCreating?: boolean;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	setCreateType?: React.Dispatch<React.SetStateAction<string>>;
	setToggleContainer?: React.Dispatch<React.SetStateAction<boolean>>;
}
const cookies = new Cookies();

const clientImage = cookies.get("avatarUrl");

const Sidebar: React.FC<{
	setProgress: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setProgress }) => {
	const logout = () => {
		setProgress(30);

		cookies.remove("token");
		cookies.remove("userId");
		cookies.remove("fullName");
		cookies.remove("avatarUrl");
		cookies.remove("username");
		setTimeout(() => {
			setProgress(100);
		}, 1000);

		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};

	return (
		<div className='channel-list__sidebar border-r border-zinc-700'>
			<div className='flex flex-col items-center place-items-center justify-between h-full pb-4'>
				<div>
					<div
						className='channel-list__sidebar__icon1'
						style={{ backgroundColor: "transparent" }}>
						<div className='icon1__inner'>
							<img
								src={logo}
								alt='logo'
								width='30'
							/>
						</div>
					</div>

					<div
						className='channel-list__sidebar__icon1 cursor-pointer'
						onClick={logout}>
						<div className='icon1__inner'>
							<TbLogout2
								size={20}
								className='text-primary'
							/>
						</div>
					</div>
				</div>
				<div>
					<img
						src={clientImage}
						className='rounded-full w-10'
					/>
				</div>
			</div>
		</div>
	);
};

const CompanyHeader = () => {
	return (
		<div className='channel-list__header'>
			<p className='channel-list__header__text'>
				<span className='font-main text-primary'>Ka-istorya</span>
			</p>
		</div>
	);
};

interface Channels {
	team: any[];
	messaging: any[];
	[key: string]: any;
}
const customChannelTeamFilter = (channels: Channels) => {
	return channels.filter((channel: { type: string }) => channel.type === "team");
};

const customChannelMessageFilter = (channels: Channels) => {
	return channels.filter((channel) => channel.type === "messaging");
};

const ChannelListContent: React.FC<Props> = ({
	isCreating,
	setIsEditing,
	setIsCreating,
	setCreateType,
	setToggleContainer,
}) => {
	const { client } = useChatContext();
	const [progress, setProgress] = useState(0);

	const filters = { members: { $in: [client.userID] } };

	return (
		<>
			<Sidebar setProgress={setProgress} />
			<div className='channel-list__list__wrapper border-r border-zinc-700'>
				<TopLoadingBar
					progress={progress}
					color='#FF60DD'
					onLoaderFinished={() => setProgress(0)}
					height={2}
				/>
				<CompanyHeader />
				<ChannelSearch setToggleContainer={setToggleContainer} />

				<ChannelList
					filters={filters}
					//eslint-disable-next-line
					//@ts-ignore
					channelRenderFilterFn={customChannelTeamFilter}
					List={(props) => (
						//eslint-disable-next-line
						//@ts-ignore
						<TeamChannelList
							{...props}
							type='team'
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setCreateType={setCreateType}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={(props) => (
						//eslint-disable-next-line
						//@ts-ignore
						<TeamChannelPreview
							{...props}
							type='team'
							setToggleContainer={setToggleContainer}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
						/>
					)}
				/>
				<ChannelList
					filters={filters}
					//eslint-disable-next-line
					//@ts-ignore
					channelRenderFilterFn={customChannelMessageFilter}
					List={(props) => (
						//eslint-disable-next-line
						//@ts-ignore
						<TeamChannelList
							{...props}
							type='messaging'
							isCreating={isCreating}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
							setCreateType={setCreateType}
							setToggleContainer={setToggleContainer}
						/>
					)}
					Preview={(props) => (
						//eslint-disable-next-line
						//@ts-ignore
						<TeamChannelPreview
							{...props}
							type='messaging'
							setToggleContainer={setToggleContainer}
							setIsCreating={setIsCreating}
							setIsEditing={setIsEditing}
						/>
					)}
				/>
			</div>
		</>
	);
};

const ChannelListContainer: React.FC<Props> = ({
	setCreateType,
	setIsCreating,
	setIsEditing,
}) => {
	const [toggleContainer, setToggleContainer] = useState(false);

	return (
		<>
			<div className='channel-list__container'>
				<ChannelListContent
					setIsCreating={setIsCreating}
					setIsEditing={setIsEditing}
					setCreateType={setCreateType}
				/>
			</div>
			<div
				className='channel-list__container-responsive'
				style={{
					left: toggleContainer ? "0%" : "-89%",
					backgroundColor: "#0f0f0f",
				}}>
				<div
					className='channel-list__container-toggle'
					onClick={() =>
						setToggleContainer((prevToggleContainer) => !prevToggleContainer)
					}>
					<ChannelListContent
						setIsCreating={setIsCreating}
						setIsEditing={setIsEditing}
						setCreateType={setCreateType}
						setToggleContainer={setToggleContainer}
					/>
				</div>
			</div>
		</>
	);
};

export default ChannelListContainer;
