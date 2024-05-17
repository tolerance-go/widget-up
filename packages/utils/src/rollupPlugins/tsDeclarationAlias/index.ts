import { Plugin } from "rollup";
import { main } from "./main";

const tsDeclarationAlias = (): Plugin => {
  return {
    name: "declaration-alias",
    writeBundle() {
      main();
    },
  };
};

export default tsDeclarationAlias;
