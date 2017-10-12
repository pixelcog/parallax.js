export class ParallaxOptions{
  public src: string | null = null;
  public speed: number = 0.2;
  public bleed: number = 0;
  public zIndex: number = -100;
  public posX: string = "center";
  public posY: string = "center";
  public overScrollFix: boolean = false;
  public excludeAgents: RegExp = /(iPod|iPhone|iPad|Android)/;
  public aspectRatio: number | null = null;

  // jquery selectors
  public sliderSelector: string = ">.parallax-slider";
  public mirrorSelector: string = "body";

  // callback functions:
  //TODO any is type Parallax
  public afterRefresh: ((any) => void) | null = null;
  public afterRender: ((any) => void) | null = null;
  public afterSetup: ((any) => void) | null = null;
  public afterDestroy: ((any) => void) | null = null;
}

