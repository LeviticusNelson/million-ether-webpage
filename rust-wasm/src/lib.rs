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
    is_blank: bool,
    r: u8,
    b: u8,
    g: u8,
}


#[wasm_bindgen]
impl Pixel {
    fn blank() -> Pixel {
        Pixel { is_blank: true, r: 0, g: 0, b: 0, }
    }
    fn is_blank(&self) -> bool {
        self.is_blank
    }
    fn get_color(&self) -> [u8; 3] {
        [self.r, self.g, self.b]
    }

    // fn change(&mut self) {
    //     *self = Pixel {is_blank: false, color: self.color};
    // }
}


#[wasm_bindgen]
pub struct Image {
    width: u32,
    height: u32,
    pixels: Vec<Pixel>,
}

impl Image {
    fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }
}

#[wasm_bindgen]
impl Image {
    pub fn new(width: u32, height: u32) -> Image {
        let mut pixels = Vec::new();
        pixels.resize(width as usize * height as usize, Pixel{
            is_blank: true,
            r: 200,
            g: 200,
            b: 200,
        },
    );
        Image {
            width,
            height,
            pixels,
        }
    }

    // pub fn render(&self) -> String {
    //     self.to_string()
    // }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn pixels(&self) -> Vec<u8> {
        self.pixels
            .iter()
            .map(|&rgb| vec![rgb.r, rgb.g, rgb.b])
            .collect::<Vec<Vec<u8>>>()
            .concat()
    }

    // pub fn change_pixel(&mut self, row: u32, col: u32) {
    //     let idx = self.get_index(row, col);
    //     self.pixels[idx].change();
    // }
}