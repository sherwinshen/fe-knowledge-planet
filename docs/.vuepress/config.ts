import { defineUserConfig, defaultTheme } from "vuepress";
// import { docsearchPlugin } from "@vuepress/plugin-docsearch";

export default defineUserConfig({
  lang: "zh-CN",
  title: "前端星球",
  description: "Sherwin's 知识宇宙之前端星球",
  head: [["link", { rel: "icon", href: " /images/logo.png" }]],
  theme: defaultTheme({
    logo: "/images/logo.png",
    navbar: [
      { text: "首页", link: "/" },
      {
        text: "技术专栏",
        link: "/technology",
      },
      {
        text: "学习专栏",
        link: "/learning",
      },
      {
        text: "面试专栏",
        link: "/interview",
      },
      {
        text: "收藏夹",
        link: "/collections",
      },
      {
        text: "其他星球",
        children: [
          {
            text: "Github",
            link: "https://github.com/sherwinshen",
          },
        ],
      },
    ],
    sidebarDepth: 3,
  }),
  markdown: {
    headers: {
      level: [2, 3, 4],
    },
  },
  plugins: [
    // docsearchPlugin(),
  ],
});
