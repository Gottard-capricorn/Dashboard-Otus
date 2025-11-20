import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",

  entry: "./src/controller.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },

  plugins: [new HtmlWebpackPlugin({ template: "./src/dashBoard.html" })],
};
