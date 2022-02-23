mod utils;

use postgrest::Postgrest;
use serde_json::{Value};
use wasm_bindgen::prelude::*;
use serde::{ser::{Serialize, Serializer, SerializeStruct}, Deserialize};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Clone, Copy, Deserialize)]
#[wasm_bindgen]
pub struct Pixel {
    id: u64,
    is_blank: bool,
    r: u8,
    g: u8,
    b: u8,
}

#[wasm_bindgen]
impl Pixel {
    pub fn encode(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    pub fn decode(val: &JsValue) -> Pixel {
        let deserialized: Pixel = val.into_serde().unwrap();
        deserialized
    }

    pub fn id(&self) -> u64 {
        self.id
    }

    pub fn r(&self) -> u8 {
        self.r
    }

    pub fn g(&self) -> u8 {
        self.g
    }

    pub fn b(&self) -> u8 {
        self.b
    }

}

impl Serialize for Pixel {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        {
            let mut state = serializer.serialize_struct("Pixel", 5)?;
            state.serialize_field("id", &self.id)?;
            state.serialize_field("is_blank", &self.is_blank)?;
            state.serialize_field("r", &self.r)?;
            state.serialize_field("g", &self.g)?;
            state.serialize_field("b", &self.b)?;
            state.end()
        }
}


#[derive( Deserialize)]
#[wasm_bindgen]
pub struct Image {
    id: u64,
    width: u32,
    height: u32,
    pixels: Vec<Pixel>,
}


#[wasm_bindgen]
impl Image {
    pub fn new(width: u32, height: u32) -> Image {
        let id = 0 as u64;
        let mut pixels = Vec::new();
        let mut pixel_id = 0 as u64;
        for _y in 0..=height {
            for _x in 0..=width {
                pixels.push(Pixel{
                    is_blank: true,
                    r: 255,
                    g: 255,
                    b: 255,
                    id: pixel_id});
                    pixel_id += 1;
            }
        }
        
        Image {
            id,
            width,
            height,
            pixels,
        }
    }

    pub fn decode(val: &JsValue) -> Image {
        let deserialized: Image = val.into_serde().unwrap();
        deserialized
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn get_index(&self, row: u32, col: u32) -> usize {
        (col * self.width + row) as usize
    }

    pub fn get_pixel(&self, row: u32, col: u32) -> Pixel {
        self.pixels[self.get_index(row, col)]
    }

    pub fn sort_pixels(&mut self) {
        self.pixels.sort_by(|x,y| x.id.cmp(&y.id))
    }

    pub fn pixels(&self) -> Vec<u8> {
        self.pixels
            .iter()
            .map(|&rgb| vec![rgb.r, rgb.g, rgb.b])
            .collect::<Vec<Vec<u8>>>()
            .concat()
    }

    pub fn paint(&mut self, x: u32, y: u32, color: Vec<u8>) {
        let idx = self.get_index(x, y);
        if self.pixels[idx].r == color[0] && self.pixels[idx].g == color[1] && self.pixels[idx].b == color[2] {return};
        self.pixels[idx] = Pixel {is_blank: false, r: color[0], g: color[1], b: color[2], id: self.pixels[idx].id};
    }

    pub fn encode(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

}

// Returns JSON representation of Image
#[wasm_bindgen]
pub async fn get_image_from_db(url: String, key: String, token: String) -> Result<JsValue, JsError> {
    let mut authorization : String = "Bearer ".to_owned();
    authorization.push_str(&token);

    let client = Postgrest::new(url.to_string()).insert_header("apikey", key.to_string()).insert_header("Authorization", authorization.to_string()).schema("public");
    
    let image_result = client.from("Images").select("id,width,height").order("id.desc").limit(1).execute().await?;
    let image_body = image_result.text().await?;
    let image_id = get_image_value(&image_body, "id").unwrap();
    let pixel_body = get_pixels_from_db(client, image_id).await?;
    let insert_pixel = [r#","pixels":"#,&pixel_body].concat();
    let mut image_body = image_body.replace("}]", "");
    image_body.push_str(&insert_pixel);
    image_body.push_str("}]");
    Ok(JsValue::from_serde(&image_body).unwrap())
}


fn get_image_value(json_string: &String, key: &str) -> Result<String, serde_json::Error> {
    let json : Value = serde_json::from_str(&json_string)?;
    let result = &json[0][key];
    Ok(result.to_string())
}


async fn get_pixels_from_db(client : Postgrest, image_id : String) -> Result<String, JsError> {
    let pixel_results = client.from("Pixels").select("id,is_blank,r,g,b").eq("image_id", image_id).execute().await?;
    let pixel_body = pixel_results.text().await?;
    Ok(pixel_body)
}

impl Serialize for Image {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        {
            let mut state = serializer.serialize_struct("Image", 2)?;
            state.serialize_field("width", &self.width)?;
            state.serialize_field("height", &self.height)?;
            state.end()
        }
}

