import {Parallax} from "./parallax";
import generatePlugin from "./generate-plugin";

export * from "./generate-plugin";
export * from "./parallax";
export * from "./parallaxOptions";

export function main(){
  $(() => {
    if (Parallax.AUTOINIT) {
      ($('[data-parallax]') as any).parallax();
    }
  });

  generatePlugin('parallax', Parallax);
}

main();
