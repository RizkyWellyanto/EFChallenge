/*global famous*/
// dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var ImageSurface = famous.surfaces.ImageSurface;
var Surface = famous.core.Surface;
var StateModifier = famous.modifiers.StateModifier;
var Easing = famous.transitions.Easing;
var EventHandler = famous.core.EventHandler;
var Transitionable = famous.transitions.Transitionable;
var RenderController = famous.views.RenderController;

var mainContext = Engine.createContext();
var initialTime = Date.now();

// main particle
var mainRenderController = new RenderController();

var mainParticle = new Surface({
  size: [250, 250],
  content: "Hello World!",
  properties: {
    color: '#993333',
    backgroundColor: '#FF0000',
    border: '5px solid #FF0000',
    borderRadius: '250px',
    textAlign: 'center',
    verticalAlign:'center',
    fontSize:"60px",
    fontFamily:'sans-serif',
    lineHeight:'100px'
  }
});

var centerPositionModifier = new StateModifier({
  origin: [0.5, 0.5],
  align: [0.5, 0.5]
});

var beatModifier = new Modifier({
  transform: function () {
    return Transform.scale(1 + (1 / 8) * Math.sin((Date.now() - initialTime) / 125));
  }
});

mainRenderController.hide(mainParticle);

// supporting particles
function createRandomCell() {
  var renderController = new RenderController();

  var positionState = new Transitionable([Math.random(),Math.random()]);
  var scaleState = new Transitionable(0.5);

  positionState.set(
    [0.5,0.5],
    {duration: 2000, curve:Easing.inOutBack},
    function(){
      this.hide(particleSurface);
    }.bind(renderController)
  );

  scaleState.set(
    1.5,
    {duration: 2000, curve:Easing.inOutExpo}
  );

  var randomSize = Math.random() * (150 - 15) + 15;
  var particleSurface = new Surface({
    size: [randomSize, randomSize],
    properties: {
      backgroundColor: '#FF3300',
      borderRadius: randomSize + 'px'
    }
  });

  var scaleModifier = new Modifier({
    transform:function(){
      var scale = scaleState.get();

      return Transform.scale(scale,scale,scale);
    },
    opacity:function(){
      return scaleState.get();
    }
  });

  var centerOriginModifier = new StateModifier({
    origin: [0.5, 0.5]
  });

  var randomAlignModifier = new Modifier({
    align: function(){
      return positionState.get();
    }
  });

  renderController.show(particleSurface);

  mainContext
    .add(randomAlignModifier)
    .add(centerOriginModifier)
    .add(scaleModifier)
    .add(renderController);
}

// Main flow
mainContext
  .add(centerPositionModifier)
  .add(beatModifier)
  .add(mainRenderController);

var cellSpawnAnimation = window.setInterval(function(){
  createRandomCell();
}, 12.5);

Engine.on('click', function(){
  window.clearInterval(cellSpawnAnimation);
  mainRenderController.show(mainParticle);
});
