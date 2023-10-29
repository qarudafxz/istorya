import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import { LuSearch } from "react-icons/lu";

const ChannelSearch: React.FC = () => {
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);

	const getChannels = async (input: string) => {
		try {
			// TODO: get channels
		} catch (error) {
			console.log(error);
		}
	};

	const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setLoading(true);
		setUsername(e.target.value);
		getChannels(e.target.value);
	};

	return (
		<div className='channel-search__container'>
			<div className='channel-search__input__wrapper'>
				<div className='channel-search__input__icon'>
					<LuSearch size={20} />
				</div>
				<input
					className='channel-search__input__text '
					placeholder='Search kaistroya'
					type='text'
					value={username}
					onChange={searchUser}
				/>
			</div>
		</div>
	);
};

export default ChannelSearch;
