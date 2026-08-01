import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages で公開する場合、base をリポジトリ名に合わせてください。
// 例: https://ユーザー名.github.io/my-palette-beauty/ で公開するなら "/my-palette-beauty/"
export default defineConfig({
  plugins: [react()],
  base: "/my-palette-beauty/",
});
