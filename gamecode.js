document.onkeydown = OnKeyIsDown;

var renderer, scene, camera;
var cubes;
var elapsedTime;

var board;
var positions;
var nrOfRows;
var nrOfColumns;

var bricks;
var terrainMaterial1;
var terrainMaterial2;

var currentPosition = 0;
var snek;
var snekMaxLength;
var currentdirection = 2;

setup();
animate();

function updateSnek()
{
    if(snek.length < snekMaxLength)
    {snek.push(currentPosition);}
    else
    {
        board[snek[0]] = 0;

        for(var i = 0; i < snek.length-1; i++)
        {
                snek[i] = snek[i + 1];
        }
        snek[snek.length-1] = currentPosition;

    }

    for(var i = 0; i < snek.length; i++)
    {
        board[snek[i]] = 1+i;
    }
    for(var i = 0; i < positions; i++)
    {
        if (board[i] > 1)
        {
            bricks[i].material = terrainMaterial1;
            bricks[i].geometry = new THREE.BoxGeometry(10,board[i],10);
            bricks[i].position.y = board[i]/2;
        }
        else
        {
            bricks[i].material = terrainMaterial2;
            bricks[i].geometry = new THREE.BoxGeometry(10,1,10);
            bricks[i].position.y = 0;
        }
    }
}

function setupBoard()
{
    board = new Array();
    
    nrOfRows = 10;
    nrOfColumns = 10;
    positions = nrOfColumns * nrOfRows;
    board.push(1);
    for(var i = 1; i < nrOfRows*nrOfColumns; ++i)
    {
        board.push(0);
        /* var row = new Array();
        for(var j = 0; j < nrOfColumns; ++j)
        { 
            row.push(0);
        }
        board.push(row); */
    }
}

function setupCubes()
{
    cubes = new Array();
    var i;
    for(i = -5; i < 5; i++)
    {
        var cubeGeometry = new THREE.BoxGeometry(10,10,10);// new THREE.PlaneGeometry(50,50,1,1);
        // terrainGeometry.rotateX(-1.5);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfefefe});
        // terrain.computeFlatVertexNormals();
        var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
        cube.position.x += i * 11;
        cubes.push(cube);
    }
     
}

function setup(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspect = width/height;
    
    setupBoard();
    snekMaxLength = 3;
    snek = new Array();
    // Renderer
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(width, height);
    renderer.setClearColor(0xbebebe, 1);
    document.body.appendChild(renderer.domElement);

    //Scene
    scene = new THREE.Scene();

    // Fog
    //scene.fog = new THREE.FogExp2( 0xf0fff0, 0.14 );

    // Camera
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.z = 140;
    camera.position.y = 50;
    camera.position.x = nrOfColumns*10/2;
    camera.rotation.x = -0.7;
    scene.add(camera);

    // SHAPES
    var terrainGeometry = new THREE.BoxGeometry(10,1,10);// new THREE.PlaneGeometry(50,50,1,1);
   // terrainGeometry.rotateX(-1.5);
    terrainMaterial1 = new THREE.MeshLambertMaterial({color: 0x3e3e3e});
    terrainMaterial2 = new THREE.MeshLambertMaterial({color: 0xffffff});
   // terrain.computeFlatVertexNormals();
   // terrain = new THREE.Mesh(terrainGeometry,terrainMaterial);
   var row = 0;
   var column;
   bricks = new Array();
    for(var i = 0; i < positions; i++)
    {
        if(i % nrOfRows == 0){row++; column = 0;}
        if (board[i] > 1)
        {
            terrain = new THREE.Mesh(terrainGeometry,terrainMaterial1);
        }
        else
        {
            terrain = new THREE.Mesh(terrainGeometry,terrainMaterial2);
        }
        terrain.position.x = column * 11;
        terrain.position.z = row * 11;
        column++;
        bricks.push(terrain);
        scene.add(terrain);
    } 
    
    
   // setupCubes();

    /* var i = 0;
    for(i = 0; i < cubes.length; i++)
    {
        scene.add(cubes[i]);
    } */
    
    // PlayerChar
    var playerGeometry = new THREE.DodecahedronGeometry(7,1);
    playerGeometry.computeFlatVertexNormals();
    var playerMaterial = new THREE.MeshLambertMaterial({color: 0x0095DD});// = new THREE.StandarMaterial({ color: 0xe5f2f2, shading:THREE.FlatShading});
    player = new THREE.Mesh(playerGeometry,playerMaterial);
    //scene.add(player);

    // LIGHT
    var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, 0.9);
    scene.add(hemisphereLight);
    var sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    sun.position.set(12,6,-7);
    sun.castShadow = true;
    scene.add(sun);
    
   /*  var light = new THREE.PointLight(0xFFFFFF);
    light.position.set(-10, 15, 50);
    scene.add(light); */

    elapsedTime = 0;
}

function update(){

    elapsedTime += 1;
    if (elapsedTime > 5)
    {
        switch(currentdirection)
        {
            
            case 0: // left
                    if(currentPosition%nrOfColumns == 0) break;
                    else currentPosition--;
                    updateSnek();
                break;
            case 1: // up
                    if((currentPosition/nrOfRows >> 0) == 0) break;
                    else currentPosition = currentPosition - nrOfRows;
                    updateSnek();
                break;
            case 2: // right
                    if((currentPosition+1)%nrOfColumns == 0) break;
                    else currentPosition++;
                    updateSnek();
                break;
            case 3: // down
                    if((currentPosition/nrOfRows >> 0) == nrOfRows-1) break;
                    else currentPosition = currentPosition + nrOfRows;
                    updateSnek();
                break;
        }
    }
    
   /*  for(i = 0; i < cubes.length; i++)
    {
        cubes[i].position.y = (-10.0) * Math.sin(elapsedTime*i*0.5);
        cubes[i].rotation.x = 5 * Math.sin(elapsedTime);
    } */
}

function render(){
    renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    update();
    render();
}

function OnKeyIsDown(key)
{
    switch(key.keyCode)
    {
        
        case 37:
                if(currentPosition%nrOfColumns == 0) break;
                else currentPosition--;
                currentdirection = 0;
                updateSnek();
            break;
        case 38:
                if((currentPosition/nrOfRows >> 0) == 0) break;
                else currentPosition = currentPosition - nrOfRows;
                currentdirection = 1;
                updateSnek();
            break;
        case 39:
                if((currentPosition+1)%nrOfColumns == 0) break;
                else currentPosition++;
                currentdirection = 2;
                updateSnek();
            break;
        case 40:
                if((currentPosition/nrOfRows >> 0) == nrOfRows-1) break;
                else currentPosition = currentPosition + nrOfRows;
                currentdirection = 3;
                updateSnek();
            break;
        case 32:
            snekMaxLength++;
            break;
        default:
            break;
    }
}