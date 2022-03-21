import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login({ session }) {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);

	async function login() {
		if (!email) return;
		const { error, data } = await supabase.auth.signIn({
			email,
		});
		if (error) {
			console.error({ error });
		} else {
			setSubmitted(true);
		}
	}
	if (submitted) {
		return (
			<div className=''>
				<h1>Please check your email to sign in</h1>
			</div>
		);
	}

	const onFormSubmit = (e) => {
		login();
	};

	return (
		<div className='flex w-full h-full justify-center items-center'>
			<main>
				<h1 className='text-2xl'>Login</h1>
				<form onSubmit={onFormSubmit}>
					<input
						placeholder='Enter email'
						className='border-2 border-black'
						type='text'
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button
						className='border-2 border-blue-50 bg-blue-400 p-2'
						type='submit'>
						Login
					</button>
				</form>
			</main>
		</div>
	);
}
