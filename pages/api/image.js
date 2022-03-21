import { supabase } from "../../utils/supabaseClient";

//Todo: use WASM functions when NextJs adds support
export default async function handler(req, res) {
	const {data, error} = await supabase.from("Images")
										.select(`id,width,height`)
										.order('id', {ascending: false}).single();
	let image = await data;
	if (data) {
		const {data, error} = await supabase.from("Pixels")
														.select("id,is_blank,r,g,b")
														.eq("image_id", image.id);
		let pixels = data;
		image.pixels = pixels;
		if (data) {
			res.status(200).json(image);
		} else if (error) {
			res.status(405).json(error);
		}
	} else if (error) {
		res.status(500).json(error);
	}
}
