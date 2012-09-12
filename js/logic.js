var canvas1;
var ctx;
var canvas2;
var ctx2;
var board_size;
var tile_size;
var player_red;
var board;
var winner_total;
var winning_positions;
var blocks = [];
var winner;
var last_done;
var drop_zone_block = {};

function init(){

	canvas1 = document.getElementById('c');
	ctx = canvas1.getContext('2d');
	
	canvas2 = document.getElementById('drop_zone');
	ctx2 = canvas2.getContext('2d');
	
	canvas1.addEventListener('mousedown', getPosition, false);
	canvas1.addEventListener('mousemove', get_mouse_position, false);
	
	drop_zone_block = {
		color: "#E77676",
		x: 0
	};

	var date = new Date();
    var time = date.getTime();
    animate(time);
	new_game();
   
}
function new_game(){
	
	canvas1 = document.getElementById('c');
	ctx = canvas1.getContext('2d');
	board_size = 7;
	tile_size = 400/board_size;
	player_red = true;
	blocks = [];
    board = newFilledArray(board_size*board_size, 0);
	ctx.clearRect(0, 0, canvas1.width, canvas1.height);
	
	
	if(winner){
		var date = new Date();
		var time = date.getTime();
		winner = false;
		last_done = false;
		animate(time);
	}else{
		winner = false;
		last_done = false;
	}
}
function newFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}

function draw_board(){
	var ctx1 = canvas1.getContext('2d');
	ctx1.shadowOffsetX = 3;
	ctx1.shadowOffsetY = 3;
	ctx1.shadowBlur    = 4;
	ctx1.shadowColor  = "#000";
    for(var i =0; i < board_size+1; i++){
        ctx1.fillStyle = "#9A9AA1";
        ctx1.fillRect(i*tile_size, 0, 1, 400);
        ctx1.fill();                
    }  
    for(var i =0; i < board_size+1; i++){
        ctx1.fillStyle = "#9A9AA1";
        ctx1.fillRect(0, i*tile_size, 400, 1);
        ctx1.fill();                
    }         
}
function getPosition(event) {
    var x = new Number();
    var y = new Number();
    if (event.x != undefined && event.y != undefined) {
        x = event.x;
        y = event.y;
    }
    else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas1.offsetLeft;
    y -= canvas1.offsetTop;
    collision(x, y);
}


//Cllean This the fuck up
function collision(pos_x, pos_y) {
    var count = 0;
    for (var j = 0; j < board_size; j++) {
        for (var i = 0; i < board_size; i++) {
            if (pos_x > i * tile_size && pos_x < (i * tile_size) + tile_size && pos_y > j * tile_size && pos_y < (j * tile_size) + tile_size) {
				if(player_red){
                    if(board[i] ===0){
                        if(check_winner(drop_tile("#E77676", i, 1, count),1)){
							winner = true;
						}
                        player_red = false;
						document.getElementById('player').innerHTML = "green";
						document.getElementById('player').style.color = "#65C665";
						drop_zone_block.color = "65C665";
                    }
				}
                else
                {
                    if(board[i] ===0){
                        if(check_winner(drop_tile("#65C665", i, -1, count), -1)){
							winner = true;
						}
                        player_red = true;
						document.getElementById('player').innerHTML = "red";
						document.getElementById('player').style.color = "#E77676";
						drop_zone_block.color = "E77676";
                    }
                }
            }
            count++;
        }
    }
}

function check_winner(i, key){

	winning_positions = new Array();
	winner_total = 0;
	mark(i, key, board_size);
	winning_positions.sort();
	if(winner_total >= 3){
		return true;
	}
	
	winning_positions = new Array();
	winner_total = 0;
	mark_horizontal(i, key, -1, board_size-1);
	mark_horizontal(i, key, 1, 0);
	winning_positions.sort();
	if(winner_total >= 3){
		return true;
	}
	
	winning_positions = new Array();
	winner_total = 0;
	if((i%board_size) != 0){
		mark_horizontal(i, key, board_size-1, board_size-1);
	}
	if((i%board_size) != (board_size-1)){
		mark_horizontal(i, key, -board_size+1, 0);
	}
	winning_positions.sort();
	if(winner_total >= 3){
		return true;
	}
	
	winning_positions = new Array();
	winner_total = 0;
	if((i%board_size) != (board_size-1)){
		mark_horizontal(i, key, board_size+1, 0);
	}
	if((i%board_size) != 0){
		mark_horizontal(i, key, -board_size-1, board_size-1);
	}
	winning_positions.sort();
	if(winner_total >= 3){
		return true;
	}
	return false;
}
function mark(i, key, direction){
	if((i < (board_size*board_size) - board_size) && board[i + direction] === key){
			winner_total++;
			winning_positions.push(i);
			return mark(i+direction, key, direction);
	}else{
		winning_positions.push(i);
		return;
	}
}
function mark_horizontal(i, key, direction, cap){
	
	if( (((i+direction)%board_size) != cap) && (board[i + direction] === key)){
			winner_total++;
			winning_positions.push(i);
			mark_horizontal(i+direction, key, direction, cap);
	}else{
		winning_positions.push(i);
		return;
	}
}
function ai_move(){
	var randomnumber;
	do{
		randomnumber = Math.floor(Math.random()*10);
	}while(board[randomnumber] != 0);

	drop_tile("#65C665", randomnumber);
	player_red = true;
}
function drop_tile(color_in, i, key, count){
	var row = i;
    var counter = 0;
    while(i < (board_size*board_size) - board_size) {
        if(board[i+board_size] == 0){
            i+= board_size;  
            counter++;                    
        }else{
            break;     
        }            
    }
	blocks[blocks.length] = {
		x: row*tile_size+5,
		y: 0,
		vx: 0,
		vy: 0,
		width: tile_size-9,
		height: tile_size-10,
		animate_to: counter*tile_size+5,
		to_animate: true,
		key: count,
		color: color_in
	};
	board[i] = key;
	return i;
}
