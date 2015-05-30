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
var mainText = '<h1 id="mainTextContent">BIGASS PARTICLE!</h1>';

var mainParticle = new Surface({
  size: [100, 100],
  //content: mainText,
  properties: {
    color: 'red',
    backgroundColor: 'red',
    border: '5px solid red',
    borderRadius: '200px',
    textAlign: 'center'
  }
});

var centerPositionModifier = new StateModifier({
  origin: [0.5, 0.5],
  align: [0.5, 0.5]
});

var scaleModifier = new StateModifier();
scaleModifier.setTransform(
  Transform.scale(2, 2, 1), {
    duration: 3000,
    curve: Easing.inOutBack
  }
);

var beatModifier = new Modifier({
  transform: function () {
    return Transform.scale(1 + (1 / 8) * Math.sin((Date.now() - initialTime) / 125));
  }
});

//var mainParticleHandler = new EventHandler();
//mainParticle.on('click', function () {
//  // stop the smaller particle spawning
//  mainParticleHandler.emit('mainClicked');
//});

//mainParticleHandler.on('mainClicked', function () {
//  // make explode animation
//});

var inFrontModifier = new Modifier({
  transform: Transform.inFront
});

// supporting particle
function createRandomCell() {
  var renderController = new RenderController();

  var positionState = new Transitionable([Math.random(),Math.random()]);
  var scaleState = new Transitionable(0.5);

  positionState.set(
    [0.5,0.5],
    {duration: 2000},
    function(){
      this.hide(particleSurface);
    }.bind(renderController)
  );

  scaleState.set(
    1.5,
    {duration: 2000, curve:Easing.inOutBack}
  );

  var randomSize = Math.random() * (100 - 10) + 10;
  var particleSurface = new Surface({
    size: [randomSize, randomSize],
    properties: {
      backgroundColor: 'red',
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

  var behindModifier = new Modifier({
    transform: Transform.behind
  });

  renderController.show(
    particleSurface
  );

  mainContext
    .add(behindModifier)
    .add(randomAlignModifier)
    .add(centerOriginModifier)
    .add(scaleModifier)
    .add(renderController);
}

mainContext
  .add(inFrontModifier)
  .add(centerPositionModifier)
  .add(scaleModifier)
  .add(beatModifier)
  .add(mainParticle);

var cellSpawnAnimation = window.setInterval(function(){
  createRandomCell();
}, 12.5);

Engine.on('click', function(){
  window.clearInterval(cellSpawnAnimation);
});
