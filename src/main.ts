import {Parallax} from "./parallax";
import generatePlugin from "./generate-plugin";

export * from "./parallax";
export * from "./parallaxOptions";

export function main(){
  generatePlugin('parallax', Parallax);

  $(() => {
    if (Parallax.AUTOINIT) {
      ($('[data-parallax]') as any).parallax();
    }
  });
}

main();
