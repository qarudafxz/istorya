import React, { useState } from "react";
import Cookies from "universal-cookie";
import { buildUrl } from "../../utils/buildUrl.ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TopLoadingBar from "react-top-loading-bar";

import bg from "../../assets/dark_bg.png";
import logo from "../../assets/logo.png";

const cookies = new Cookies();

const initialState = {
	fullName: "",
	username: "",
	password: "",
	confirmPassword: "",
	avatarUrl: "",
};

const Auth: React.FC = () => {
	const [form, setForm] = useState(initialState);
	const [isSignup, setIsSignup] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { fullName, username, password, confirmPassword, avatarUrl } = form;
		setProgress(30);
		try {
			fetch(buildUrl(`/auth/${isSignup ? "signup" : "login"}`), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName,
					username,
					password,
					avatarUrl,
					confirmPassword,
				}),
			}).then(async (res) => {
				const data = await res.json();
				if (res.ok || res.status === 200) {
					cookies.set("token", data.token);
					cookies.set("username", data.username);
					cookies.set("fullName", data.fullName);
					cookies.set("userId", data.userId);
					cookies.set("avatarUrl", data.avatarUrl);
					setProgress(100);
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				}

				toast.error(data.message, {
					position: "top-center",
					autoClose: 1500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					theme: "dark",
				});
				setProgress(100);
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<div
			className='bg-[#0A0A0A] w-full h-screen flex flex-col justify-center items-center font-main'
			style={{
				backgroundImage: `url(${bg})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			<ToastContainer />
			<TopLoadingBar
				progress={progress}
				color='#FF60DD'
				onLoaderFinished={() => setProgress(0)}
				height={2}
			/>
			<img
				src={logo}
				alt='Logo'
				width={120}
			/>

			<h2 className='mt-3 text-center text-4xl tracking-tight font-main font-bold text-white'>
				<span>{isSignup ? "Sign Up" : "Sign In"}</span> in to your{" "}
				<span className='bg-gradient-to-tr from-secondary to-primary text-transparent bg-clip-text'>
					account
				</span>
			</h2>
			{/* Form */}
			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-[#040404] border border-zinc-700 px-4 py-8 shadow-md sm:rounded-lg sm:px-10'>
					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						{isSignup && (
							<div>
								<label
									htmlFor='fullName'
									className='block text-white text-sm font-medium mb-1'>
									Full Name
								</label>
								<input
									type='text'
									name='fullName'
									id='fullName'
									onChange={handleChange}
									className='bg-[#0A0A0A] border border-zinc-800 rounded-md p-2 w-full text-white'
								/>
							</div>
						)}
						<label
							htmlFor='username'
							className='block text-white text-sm font-medium mb-1'>
							Username
						</label>
						<input
							type='text'
							name='username'
							id='username'
							onChange={handleChange}
							className='bg-[#0A0A0A] border border-zinc-800 rounded-md p-2 w-full text-white'
						/>
						{isSignup && (
							<div>
								<label
									htmlFor='avatarUrl'
									className='block text-white text-sm font-medium mb-1'>
									Avatar Image
								</label>
								<input
									type='text'
									name='avatarUrl'
									id='avatarUrl'
									placeholder='Paste URL here'
									onChange={handleChange}
									className='bg-[#0A0A0A] border border-zinc-800 rounded-md p-2 w-full text-white'
								/>
							</div>
						)}
						<div>
							<label
								htmlFor='password'
								className='block text-white text-sm font-medium mb-1'>
								Password
							</label>
							<input
								type='password'
								name='password'
								id='password'
								onChange={handleChange}
								className='bg-[#0A0A0A] border border-zinc-800 rounded-md p-2 w-full text-white'
							/>
						</div>
						{isSignup && (
							<div>
								<label
									htmlFor='confirmPassword'
									className='block text-white text-sm font-medium mb-1'>
									Confirm Password
								</label>
								<input
									type='password'
									name='confirmPassword'
									id='confirmPassword'
									onChange={handleChange}
									className='bg-[#0A0A0A] border border-zinc-800 rounded-md p-2 w-full text-white'
								/>
							</div>
						)}
						<button className='bg-primary w-full py-2 rounded-md text-white font-semibold'>
							{isSignup ? "Sign Up" : "Log In"}
						</button>
						<div className='flex gap-2 items-center justify-center text-sm mt-6 px-2 text-zinc-600'>
							<div className='font-main'>
								{isSignup ? "Already have an account?" : "New to istorya?"}
							</div>
							<div
								onClick={() => setIsSignup(!isSignup)}
								className='underline cursor-pointer font-main hover:text-zinc-500 duration-150'>
								{isSignup ? "Login" : "Create an account"}
							</div>
						</div>
						<div className='w-full flex items-center'>
							<span className='text-zinc-700 text-center mx-auto font-main text-[10px]'>
								Made with 🩷 by Francis and Riena
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Auth;
