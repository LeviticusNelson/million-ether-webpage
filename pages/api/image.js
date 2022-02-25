import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
	try {
		const { user, token, error } = await supabase.auth.api.getUserByCookie(req);
		const { get_image_from_db: getImage } = await import("rust-wasm");
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1";
		const image = await getImage(
			url,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			token
		);
		await res.status(200).json(image);
	} catch (err) {
		res.json(err);
		res.status(405).end();
	}
}
