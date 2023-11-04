/* eslint-disable no-undef */
import crypto from "crypto";
import StreamChat from "stream-chat";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.VITE_REACT_APP_STREAM_API_KEY;
const apiSecret = process.env.VITE_REACT_APP_STREAM_API_SECRET;

console.log(apiKey, apiSecret);

export const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const serverClient = StreamChat.StreamChat.getInstance(apiKey, apiSecret);

		if (!password || !username)
			return res.status(400).json({ message: "Fill in the fields" });

		const { users } = await serverClient.queryUsers({ username: username });

		if (users.length === 0)
			return res.status(400).json({ message: "User not found" });

		const isMatchPassword = await bcrypt.compare(password, users[0].password);

		const token = serverClient.createToken(users[0].id);

		if (isMatchPassword) {
			res.status(200).json({
				token,
				fullName: users[0].fullName,
				username,
				userId: users[0].id,
				avatarUrl: users[0].image,
			});
		} else {
			res.status(500).json({ message: "Incorrect password" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export const signup = async (req, res) => {
	const { fullName, username, password, confirmPassword, avatarUrl } = req.body;

	try {
		const userId = crypto.randomBytes(16).toString("hex");

		const serverClient = new StreamChat.StreamChat(apiKey, apiSecret);

		const { users } = await serverClient.queryUsers({ username: username });

		if (users.length > 0)
			return res.status(400).json({ message: "Username already exist" });

		if (password !== confirmPassword)
			return res.status(400).json({ message: "Passwords don't match" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const token = serverClient.createToken(userId);

		await serverClient.upsertUser({
			id: userId,
			name: username,
			fullName,
			password: hashedPassword,
			image: avatarUrl,
		});

		res
			.status(200)
			.json({ token, fullName, username, userId, hashedPassword, avatarUrl });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};
