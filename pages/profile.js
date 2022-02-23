import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {useRouter} from 'next/router';

function Profile() {
	const [profile, setProfile] = useState(null);
	const router = useRouter();

	useEffect(() => {
		fetchProfile()
	}, [])

	async function fetchProfile() {
		const profileData = await supabase.auth.user();
		if (!profileData) {
			router.push('/login');
		} else {
			setProfile(profileData)
		}
	}

	async function signOut() {
		await supabase.auth.signOut();
		router.push('/login');
	}

	if (!profile) return null;
	return (
		<div>
			<h2>Hello {profile.name}</h2>
			<p>UserId: {profile.id}</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}

export default Profile;
