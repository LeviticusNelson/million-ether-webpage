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
}
/**
*/
export class Pixel {
  free(): void;
}
