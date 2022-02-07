/* tslint:disable */
/* eslint-disable */
/**
*/
export class Image {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {Image}
*/
  static new(width: number, height: number): Image;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
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
}
/**
*/
export class Pixel {
  free(): void;
}
