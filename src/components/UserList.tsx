import React, { useState, useEffect } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { BsCheckCircleFill } from "react-icons/bs";

interface Props {
	setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
	selectedUsers?: string[];
	setToggleContainer?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListContainer = ({ children }) => {
	return (
		<div className='user-list__container'>
			<div className='user-list__header'>
				<p>User</p>
				<p>Invite</p>
			</div>
			{children}
		</div>
	);
};

const UserItem = ({ user, setSelectedUsers }) => {
	const [selected, setSelected] = useState(false);

	const handleSelect = () => {
		if (selected) {
			setSelectedUsers((prevUsers) =>
				prevUsers.filter((prevUser) => prevUser !== user.id)
			);
		} else {
			setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
		}
		setSelected((prevSelected) => !prevSelected);
	};

	return (
		<div className='user-item__wrapper'>
			<div
				className='user-item__name-wrapper cursor-pointer'
				onClick={handleSelect}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<div className='flex items-center gap-2'>
					<Avatar
						image={user.image}
						name={user.fullName || user?.id}
						size={32}
					/>
					<p className='user-item__name'>{user.fullName || user.id}</p>
				</div>
				{selected ? (
					<BsCheckCircleFill
						className='text-primary'
						size={32}
					/>
				) : (
					<div className='user-item__invite-empty' />
				)}
			</div>
		</div>
	);
};

const UserList: React.FC<Props> = ({ setSelectedUsers }) => {
	const { client } = useChatContext();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [listEmpty, setListEmpty] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const getUsers = async () => {
			if (loading) return;

			setLoading(true);
			try {
				const response = await client.queryUsers(
					{ id: { $ne: client.userID } },
					{ id: 1 },
					{ limit: 8 }
				);

				response.users.length ? setUsers(response?.users) : setListEmpty(true);
			} catch (err) {
				setError(true);
			}
			setLoading(false);
		};
		if (client) getUsers();
	}, []);

	return (
		<ListContainer>
			{loading ? <div className='user-list__message'>Loading users...</div> : null}
			{listEmpty ? <div className='user-list__message'>No users found</div> : null}
			{error ? (
				<div className='user-list__message'>
					Error loading, please refresh and try again
				</div>
			) : null}
			{!loading && !listEmpty && (
				<>
					{users?.map((user, i) => (
						<UserItem
							//eslint-disable-next-line
							//@ts-ignore
							index={i}
							key={user.id}
							user={user}
							setSelectedUsers={setSelectedUsers}
						/>
					))}
				</>
			)}
		</ListContainer>
	);
};

export default UserList;
