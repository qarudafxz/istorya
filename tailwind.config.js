/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				xxxs: "250px",
				xxs: "350px",
				xs: "400px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
			},
			fontFamily: {
				main: ["Poppins", "sans-serif"],
			},
			backgroundColor: {
				pages: "#070707",
				primary: "#FF60DD",
				secondary: "#BD0DFF",
			},
			colors: {
				primary: "#FF60DD",
				secondary: "#BD0DFF",
			},
			textColor: {
				primary: "#FF60DD",
				secondary: "#BD0DFF",
			},
			borderColor: {
				primary: "#FF60DD",
				secondary: "#BD0DFF",
			},
			gradientColorStop: {
				primary: "#FF60DD",
				secondary: "#BD0DFF",
			},
		},
	},
	plugins: [],
};
