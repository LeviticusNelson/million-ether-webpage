import Canvas from "../components/canvas";
import { useEffect, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from 'next/router';

export default function Home({ user }) {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		fetchProfile();
	}, []);
	async function fetchProfile() {
		setLoading(true);
		const profileData = await supabase.auth.user();
		if (!profileData) {
			router.push("/login");
			console.log(profileData);
		} else {
			setProfile(profileData);
			setLoading(false);
		}
	}
	const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
	function handleChange(value, index) {
		let colorCopy = [...color];
		colorCopy[index] = value;
		setColor(colorCopy);
	}

	if (loading) {
		return (
			<p>loading:</p>
		)
	}

	return (
		<div className='flex-wrap overflow-auto'>
			<div className='p-10 px-16 w-full '>
				<RgbColorPicker
					className='border-4 border-black rounded-xl z-10'
					color={color}
					onChange={setColor}></RgbColorPicker>
			</div>
			<div className='flex-auto'>
				<Canvas rgb={color} userId={profile}></Canvas>
			</div>
		</div>
	);
}
