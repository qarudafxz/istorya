import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import "stream-chat-react/dist/css/index.css";
import { ChannelContainer, ChannelListContainer } from "./components";
import Auth from "./components/auth/Auth";
import { useState } from "react";

const apiKey = import.meta.env.VITE_REACT_APP_STREAM_API_KEY;

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();
const authToken = cookies.get("token");

if (authToken) {
	client.connectUser(
		{
			token: authToken,
			id: cookies.get("userId"),
			name: cookies.get("fullName"),
			image: cookies.get("avatarUrl"),
			username: cookies.get("username"),
			role: "admin",
		},
		authToken
	);
}

const App = () => {
	const [createType, setCreateType] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	if (!authToken) return <Auth />;
	return (
		<div className='app__wrapper'>
			<Chat
				client={client}
				theme='team dark'>
				<ChannelListContainer
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					setIsEditing={setIsEditing}
					setCreateType={setCreateType}
				/>
				<ChannelContainer
					isCreating={isCreating}
					setIsCreating={setIsCreating}
					isEditing={isEditing}
					setIsEditing={setIsEditing}
					createType={createType}
				/>
			</Chat>
		</div>
	);
};

export default App;
