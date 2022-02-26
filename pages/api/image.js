import { supabase } from "../../utils/supabaseClient";
import * as wasm from "rust-wasm";

export default async function handler(req, res) {
	try {
		const { get_image_from_db: getImage } = await import("rust-wasm");
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1";
		const image = await wasm.get_image_from_db(
			url,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);
		await res.status(200).json(image);
	} catch (err) {
		res.json(err);
		res.status(405).end();
	}
}
