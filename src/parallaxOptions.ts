class ParallaxOptions{
  public src: null;
  public speed= 0.2;
  public bleed= 0;
  public zIndex= -100;
  public posX= "center";
  public posY= "center";
  public overScrollFix= false;
  public mirrorContainer= "body";
  public excludeAgents= /(iPod|iPhone|iPad|Android)/;
  public aspectRatio= null;

  // jquery selectors
  public sliderSelector=">.parallax-slider";
  public mirrorSelector= "body";

  // callback functions:
  public afterRefresh= null;
  public afterRender= null;
  public afterSetup= null;
  public afterDestroy= null;
}
