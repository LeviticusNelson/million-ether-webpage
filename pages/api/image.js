import { get_image_from_db } from "rust-wasm";
export default async function handler(req, res) {
	try {
		const url = process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1";
		const image = await get_image_from_db(
			url,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		);
		await res.status(200).json(image);
	} catch (err) {
		res.json(err);
		res.status(405).end();
	}
}
