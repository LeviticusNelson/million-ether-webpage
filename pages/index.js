import Canvas from "../components/canvas";
import { useEffect, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from 'next/router';

export default function Home({ user }) {
	const [profile, setProfile] = useState(null);
	const router = useRouter();
	useEffect(() => {
		fetchProfile();
	}, []);
	async function fetchProfile() {
		const profileData = await supabase.auth.user();
		if (!profileData) {
			router.push("/login");
			console.log(profileData);
		} else {
			setProfile(profileData);
		}
	}
	const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
	function handleChange(value, index) {
		let colorCopy = [...color];
		colorCopy[index] = value;
		setColor(colorCopy);
	}

	return (
		<div className='flex px-10'>
			<div className='p-10'>
				<RgbColorPicker
					className='border-4 border-black rounded-xl'
					color={color}
					onChange={setColor}></RgbColorPicker>
			</div>
			<Canvas rgb={color} userId={profile}></Canvas>
		</div>
	);
}
