import React from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from "./";
import Cookies from "universal-cookie";
import logo from "../assets/pink_icon_logo.png";
import { RiGroup2Fill } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";

interface Props {
	isCreating?: boolean;
	setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
	setCreateType?: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar = () => {
	const logout = () => {
		const cookies = new Cookies();
		cookies.remove("token");
		cookies.remove("userId");
		cookies.remove("fullName");
		cookies.remove("avatarUrl");
		cookies.remove("username");

		window.location.reload();
	};

	return (
		<div className='channel-list__sidebar border-r border-zinc-700'>
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
			<div className='channel-list__sidebar__icon1  cursor-pointer'>
				<div className='icon1__inner'>
					<RiGroup2Fill
						size={20}
						className='text-primary'
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

const ChannelListContainer: React.FC<Props> = ({
	isCreating,

	setIsEditing,
	setIsCreating,
}) => {
	return (
		<>
			<Sidebar />
			<div className='channel-list__list__wrapper border-r border-zinc-700'>
				<CompanyHeader />
				<ChannelSearch />
				<ChannelList
					filters={{}}
					channelRenderFilterFn={() => {}}
					List={(props) => (
						<TeamChannelList
							{...props}
							type='team'
						/>
					)}
					Preview={(props) => (
						<TeamChannelPreview
							{...props}
							type='team'
						/>
					)}
				/>
				<ChannelList
					filters={{}}
					channelRenderFilterFn={() => {}}
					List={(props) => (
						<TeamChannelList
							{...props}
							type='messaging'
						/>
					)}
					Preview={(props) => (
						<TeamChannelPreview
							{...props}
							type='messaging'
						/>
					)}
				/>
			</div>
		</>
	);
};

export default ChannelListContainer;
