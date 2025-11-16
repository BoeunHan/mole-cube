import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mole-cube",
  brand: {
    displayName: "두더지큐브",
    primaryColor: "#D8D2CC",
    icon: "/icons/logo-512.png",
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
