import {Parallax} from "./parallax";
import generatePlugin from "./generate-plugin";
export * from "./parallax";
export * from "./parallaxOptions";

export function main(): void{
  generatePlugin('parallax', Parallax);

  $(() => {
    // todo: remove this option and simply do it Parallax.AUTOINIT
    if (Parallax.AUTOINIT) {
      ($('[data-parallax]') as any).parallax();
    }
  });
}

main();
