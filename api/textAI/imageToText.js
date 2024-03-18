import { pipeline } from "@xenova/transformers";

const pipe = await pipeline("image-classification");

const result = await pipe("brk-blog-4reasons-why.webp");

console.log(result);
