import { getLatestPackageVersion, semverToIdentifier } from "widget-up-utils";
// import request, { baseURL } from "./request";
import qs from "qs";

const baseURL = '';

type LibItem = {
  name: string;
  version: string;
  globalVar: string;
  depends: LibItem[];
};

export class DependencyManager {
  private static instance: DependencyManager;
  private document: Document;
  private loadedDependencies: Map<
    string,
    {
      loadedPromise: Promise<void>;
    } & LibItem
  >;

  private constructor(doc: Document) {
    this.document = doc;
    this.loadedDependencies = new Map();
  }

  public static getInstance(doc: Document): DependencyManager {
    if (!DependencyManager.instance) {
      DependencyManager.instance = new DependencyManager(doc);
    }
    return DependencyManager.instance;
  }

  addDependency({
    name,
    version,
    jsFilePath,
    cssFilePath,
    depends = [],
    globalVar,
  }: {
    name: string;
    version: string;
    jsFilePath: string;
    cssFilePath?: string;
    depends?: (string | RegExp)[];
    globalVar: string;
  }) {
    const dependencyId = DependencyManager.getDependencyId(name, version);

    if (this.loadedDependencies.has(dependencyId)) {
      console.log(`Dependency ${dependencyId} already loaded.`);
      return;
    }

    console.log("name: ", name);
    const dependenciesPromises = this.resolveDependencies(depends);
    console.log("dependenciesPromises: ", dependenciesPromises);

    const loadedPromise = Promise.all(dependenciesPromises)
      .then((resolvedDepends) =>
        this.loadResources({
          name,
          version,
          jsFilePath,
          globalVar,
          cssFilePath,
          depends: resolvedDepends as any, // 将解析的依赖详细信息传递给 loadResources
        })
      )
      .catch((error) =>
        console.error(`Error loading dependencies for ${name}: ${error}`)
      );

    this.loadedDependencies.set(dependencyId, {
      name,
      version,
      globalVar,
      loadedPromise,
      depends: [],
    });
  }

  private resolveDependencies(depends: (string | RegExp)[]): Promise<{
    name: string;
    version: string;
    globalVar: string;
  } | void>[] {
    return depends
      .map((depPattern) => {
        if (typeof depPattern === "string") {
          return (
            this.loadedDependencies
              .get(depPattern)
              ?.loadedPromise.then(() =>
                this.loadedDependencies.get(depPattern)
              ) ??
            Promise.reject(new Error(`Dependency ${depPattern} not found.`))
          );
        } else {
          // Resolve dependencies based on regular expression pattern
          const matchingDeps = Array.from(
            this.loadedDependencies.keys()
          ).filter((dep) => depPattern.test(dep));
          return matchingDeps.map(
            (dep) =>
              this.loadedDependencies
                .get(dep)
                ?.loadedPromise.then(() => this.loadedDependencies.get(dep)) ??
              Promise.reject(new Error(`Dependency ${dep} not found.`))
          );
        }
      })
      .flat();
  }

  private loadResources({
    name,
    version,
    jsFilePath,
    globalVar,
    cssFilePath,
    depends,
  }: {
    name: string;
    version: string;
    jsFilePath: string;
    cssFilePath?: string;
    depends?: {
      name: string;
      version: string;
      globalVar: string;
    }[];
    globalVar: string;
  }): Promise<void> {
    const loadPromises = [];
    // Load JavaScript file
    const script = this.document.createElement("script");

    // script.src = `https://unpkg.com/${name}@${version}${jsFilePath}`;
    script.src = `${baseURL}/unpkg/modify-umd?${qs.stringify({
      name,
      version,
      jsFilePath: jsFilePath.replace('production.min', 'development'),
      exportVar: globalVar,
      exportName: DependencyManager.getGlobalVarName(globalVar, version),
      importVar: depends?.map((item) => item.globalVar),
      importName: depends?.map((item) =>
        DependencyManager.getGlobalVarName(item.globalVar, item.version)
      ),
    })}`;

    const scriptPromise = new Promise<void>((resolve, reject) => {
      script.onload = () => {
        // if (globalVar) {
        //   const scriptGlobal = this.document.createElement("script");
        //   scriptGlobal.innerText = `window['${DependencyManager.getGlobalVarName(
        //     globalVar,
        //     version
        //   )}'] = window['${globalVar}'];`;
        //   this.document.head.appendChild(scriptGlobal);
        // }
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      this.document.head.appendChild(script);
    });
    loadPromises.push(scriptPromise);

    // Load CSS file if provided
    if (cssFilePath) {
      const link = this.document.createElement("link");
      link.href = `https://unpkg.com/${name}@${version}${cssFilePath}`;
      link.rel = "stylesheet";
      const cssPromise = new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () =>
          reject(new Error(`Failed to load CSS ${link.href}`));
        this.document.head.appendChild(link);
      });
      loadPromises.push(cssPromise);
    }

    return Promise.all(loadPromises).then(() => {
      // Ensure the promise resolves to void
    });
  }

  static getGlobalVarName(globalVar: string, version: string) {
    return `${globalVar}${semverToIdentifier(version)}`;
  }

  static getDependencyId(name: string, version: string) {
    return `${name}@${version}`;
  }
}
