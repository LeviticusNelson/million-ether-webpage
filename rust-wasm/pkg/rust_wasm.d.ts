/* tslint:disable */
/* eslint-disable */
/**
* @param {string} url
* @param {string} key
* @returns {Promise<any>}
*/
export function get_image_from_db(url: string, key: string): Promise<any>;
/**
*/
export class Image {
  free(): void;
/**
* @param {BigInt} id
* @param {number} width
* @param {number} height
* @returns {Image}
*/
  static new(id: BigInt, width: number, height: number): Image;
/**
* @param {any} val
* @returns {Image}
*/
  static decode(val: any): Image;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @param {number} row
* @param {number} col
* @returns {number}
*/
  get_index(row: number, col: number): number;
/**
* @param {number} row
* @param {number} col
* @returns {Pixel}
*/
  get_pixel(row: number, col: number): Pixel;
/**
*/
  sort_pixels(): void;
/**
* @returns {Uint8Array}
*/
  pixels(): Uint8Array;
/**
* @param {number} x
* @param {number} y
* @param {Uint8Array} color
*/
  paint(x: number, y: number, color: Uint8Array): void;
/**
* @param {number} idx
* @param {Uint8Array} color
*/
  paint_with_idx(idx: number, color: Uint8Array): void;
/**
* @returns {string}
*/
  encode(): string;
}
/**
*/
export class Pixel {
  free(): void;
/**
* @returns {string}
*/
  encode(): string;
/**
* @param {any} val
* @returns {Pixel}
*/
  static decode(val: any): Pixel;
/**
* @returns {BigInt}
*/
  id(): BigInt;
/**
* @returns {number}
*/
  r(): number;
/**
* @returns {number}
*/
  g(): number;
/**
* @returns {number}
*/
  b(): number;
}
