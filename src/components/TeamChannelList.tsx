import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface IstroyaChannelListProps {
	children?: React.ReactNode;
	error?: boolean;
	loading?: boolean;
	type?: string;
}

const IstroyaChannelList: React.FC<IstroyaChannelListProps> = ({
	children,
	error,
	loading,
	type,
}) => {
	if (error) {
		return type === "team" ? (
			<div className='channel-list__message'>
				<p className='font-main text-center text-primary text-xs p-4'>
					Error loading channels, please try again later
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
				<p className='team-channel-list__header__title'>
					{type === "team" ? "Groups" : "Direct Messages"}
					{/* Button to add channel */}
				</p>
			</div>
			{children}
		</div>
	);
};

export default IstroyaChannelList;
