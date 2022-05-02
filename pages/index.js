import Canvas from "../components/canvas";
import { useEffect, useState, Component } from "react";
import { RgbColorPicker } from "react-colorful";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { PenTool, Move } from "react-feather";
import Draggable from "react-draggable";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function Home({ user }) {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showPicker, setShowPicker] = useState(false);
	const [moving, setMoving] = useState(false);
	const [hexColor, setHexColor] = useState("#000000");
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
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	useEffect(() => {
		setHexColor(rgbToHex(color.r, color.g, color.b));
	}, [color]);
	function handleChange(value, index) {
		let colorCopy = [...color];
		colorCopy[index] = value;
		setColor(colorCopy);
	}
	let movingButtonStyle;
	let canvasPointer;
	if (moving) {
		movingButtonStyle = "border-2 border-black bg-green-500 p-2";
	} else {
		movingButtonStyle = "border-2 border-black bg-blue-400 p-2";
	}
	let picker;
	if (showPicker) {
		picker = (
			<div className='z-10 px-2'>
				<RgbColorPicker
					className='border-4 border-black rounded-xl'
					color={color}
					onChange={setColor}></RgbColorPicker>
			</div>
		);
	} else {
		picker = null;
	}

	if (loading) {
		return <p>loading:</p>;
	}

	return (
		<div className='flex md:flex-row xs:flex-col sm:flex-col sm:space-y-4 md:space-y-0'>
			<div className='p-5 flex-1'>
				<div className='flex md:flex-col sm:flex-row absolute sm:space-x-2 sm:space-y-0 md:space-x-0 md:space-y-2'>
					<div className='flex flex-row'>
						<div>
							<button
								className={"border-2 p-2 "}
								style={{ borderColor: hexColor }}
								onClick={() => {
									!showPicker ? setShowPicker(true) : setShowPicker(false);
									setMoving(false);
								}}>
								<PenTool />
							</button>
						</div>
						{picker}
					</div>
					<div className='flex flex-row'>
						<div>
							<button
								className={movingButtonStyle}
								onClick={() => {
									if (moving) {
										setMoving(false);
									} else {
										setMoving(true);
										setShowPicker(false);
									}
								}}>
								<Move />
							</button>
						</div>
					</div>
				</div>
			</div>
				<Draggable disabled={!moving} bounds={{top: -100, left: -100, right: 100, bottom: 100}}>
					<div className='p-5 flex-1'>
						<Canvas rgb={color} userId={profile} movingCursor={moving}></Canvas>
					</div>
				</Draggable>
			<div className='flex-1'></div>
		</div>
	);
}
