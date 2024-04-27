import { Plugin } from "rollup";
import { start } from "./start";

const tsDeclarationAlias = (): Plugin => {
  return {
    name: "declaration-alias",
    writeBundle() {
      start();
    },
  };
};

export default tsDeclarationAlias;
