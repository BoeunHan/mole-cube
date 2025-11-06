import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "molecube-test",
  brand: {
    displayName: "두더지게임테스트", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#D8D2CC", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
    bridgeColorMode: "basic",
  },
  web: {
    host: "192.168.0.2",
    port: 5173,
    commands: {
      dev: "next dev -H 0.0.0.0 -p 5173",
      build: "next build",
    },
  },
  permissions: [],
  outdir: "dist",
});
