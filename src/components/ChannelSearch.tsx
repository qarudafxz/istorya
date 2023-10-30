import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import { LuSearch } from "react-icons/lu";
import { ResultsDropdown } from "./";

const ChannelSearch: React.FC = () => {
	const { client, setActiveChannel } = useChatContext();

	const [query, setQuery] = useState("");
	const [teamChannels, setTeamChannels] = useState([]);
	const [directChannels, setDirectChannels] = useState([]);
	const [loading, setLoading] = useState(false);

	const getChannels = async (input: string) => {
		try {
			// TODO: get channels
			const channelResponse = client.queryChannels({
				type: "team",
				name: { $autocomplete: input },
				members: { $in: [client.userID || ""] },
			});
			const userResponse = client.queryUsers({
				id: { $ne: client.userID || "" },
				name: { $autocomplete: input },
			});

			const [channels, { users }] = await Promise.all([
				channelResponse,
				userResponse,
			]);

			if (channels.length) setTeamChannels(channels);
			if (users.length) setDirectChannels(users);
		} catch (error) {
			console.log(error);
		}
	};

	const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setLoading(true);
		setQuery(e.target.value);
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
					value={query}
					onChange={searchUser}
				/>
				{query && (
					<ResultsDropdown
						teamChannels={teamChannels}
						directChannels={directChannels}
						loading={loading}
						setActiveChannel={setActiveChannel}
						setQuery={setQuery}
						setTeamChannels={setTeamChannels}
						setDirectChannels={setDirectChannels}
					/>
				)}
			</div>
		</div>
	);
};

export default ChannelSearch;
