import fs from "fs";
import path from "path";

function addJsExtension(dirPath: string) {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      addJsExtension(filePath); // 递归处理所有文件
    } else if (filePath.endsWith(".js")) {
      let content = fs.readFileSync(filePath, "utf8");
      // 正则替换导入路径，添加.js扩展
      content = content.replace(
        /from\s+(['"])(?!.*\1)(?!\.js\b)([^'"]+)\1/g,
        "from $1$2.js$1"
      );
      fs.writeFileSync(filePath, content, "utf8");
    }
  });
}

// 指定编译输出的目录
addJsExtension("./rollup-plugins");
