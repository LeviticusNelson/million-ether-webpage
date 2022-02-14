mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Clone, Copy)]
#[wasm_bindgen]
pub struct Pixel {
    _is_blank: bool,
    r: u8,
    g: u8,
    b: u8,
    _id: u64,
}


#[wasm_bindgen]
pub struct Image {
    width: u32,
    height: u32,
    pixels: Vec<Pixel>,
}


#[wasm_bindgen]
impl Image {
    pub fn new(width: u32, height: u32) -> Image {
        let mut pixels = Vec::new();
        let mut id = 0 as u64;
        for _y in 0..=height {
            for _x in 0..=width {
                pixels.push(Pixel{
                    _is_blank: true,
                    r: 255,
                    g: 255,
                    b: 255,
                    _id: id})
            }
            id += 1;
        }
        
        Image {
            width,
            height,
            pixels,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }

    pub fn pixels(&self) -> Vec<u8> {
        self.pixels
            .iter()
            .map(|&rgb| vec![rgb.r, rgb.g, rgb.b])
            .collect::<Vec<Vec<u8>>>()
            .concat()
    }

    pub fn paint(&mut self, x: u32, y: u32, color: Vec<u8>) {
        let idx = ((y * self.width) + x)  as usize;
        self.pixels[idx] = Pixel {_is_blank: false, r: color[0], g: color[1], b: color[2], _id: self.pixels[idx]._id};
    }
}

