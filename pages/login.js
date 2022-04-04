import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login({ session }) {

	async function login() {
		const { user, session, error } = await supabase.auth.signIn({
			provider: "apple",
		});
		if (error) {
			console.error({ error });
		}
	}

	return (
		<div className='flex w-full h-full justify-center items-center'>
			<main>
				<h1 className='text-2xl'>Login</h1>
				<button
					className='border-2 border-blue-50 bg-blue-400 p-2'
					onClick={login}>
					Login
				</button>
			</main>
		</div>
	);
}
