var canvas1;
var ctx;
var canvas2;
var ctx2;
var canvas3;
var ctx3;
var board_size;
var tile_size;
var player_red;
var board;
var winner_total = {};
var winning_positions;
var blocks = [];
var winner;
var last_done;
var drop_zone_block = {};
var block_move;
var winning_amounts;
var almost_win;
var num_moves;
var play_song;
var record_release_movement;
var release_bar_rec = {};
var reset_animation;

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
	release_bar_rect = {
		x: 100,
		width: 342.85
	};
	var date = new Date();
    var time = date.getTime();
    animate(time);
	new_game();
   
}
function new_game(){
	
	canvas1 = document.getElementById('c');
	ctx = canvas1.getContext('2d');
	ctx.clearRect(0,0,canvas1.width,canvas1.height);
	board_size = 7;
	tile_size = 400/board_size;
	player_red = true;
	block_move = false;
	blocks = [];
    board = newFilledArray(board_size*board_size, 0);
	ctx.clearRect(0, 0, canvas1.width, canvas1.height);
	num_moves = 0;
	
	winner_total = {
		count: 0
	};
	if(play_song){
		document.getElementById('song').pause();
	}
	play_song = false;
	
	if(winner || reset_animation){
		var date = new Date();
		var time = date.getTime();
		winner = false;
		last_done = false;
		reset_animation = false;
		record_release_movement =false;
		animate(time);
	}else{
		winner = false;
		last_done = false;
	}
	reset_animation = false;
	record_release_movement =false;
	
	player_red = true;
	drop_zone_block.color = "E77676";
	
}
function newFilledArray(len, val) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = val;
    }
    return rv;
}

function draw_board(){
	ctx.shadowOffsetX = 1;
	ctx.shadowOffsetY = 1;
	ctx.shadowBlur    = 1;
	ctx.shadowColor  = "#000";
    for(var i =0; i < board_size+1; i++){
        ctx.fillStyle = "#9A9AA1";
        ctx.fillRect(i*tile_size, 0, 1, 400);           
    }  
    for(var i =0; i < board_size+1; i++){
        ctx.fillStyle = "#9A9AA1";
        ctx.fillRect(0, i*tile_size, 400, 1);
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
	if(!block_move){
		var count = 0;
		for (var j = 0; j < board_size; j++) {
			for (var i = 0; i < board_size; i++) {
				if (pos_x > i * tile_size && pos_x < (i * tile_size) + tile_size && pos_y > j * tile_size && pos_y < (j * tile_size) + tile_size) {
					if(board[i] ===0){
						if(check_winner(drop_tile("#E77676", i, 1),1)){
							winner = true;
							update_player_win();
							return;
						}
						num_moves++;
						player_red = false;
						drop_zone_block.color = "65C665";
						block_move = true;
						var t=setTimeout("ai_move()", 800);
						
					}
				}
				count++;
			}
		}
	}
}

function check_winner(i, key){

	almost_win = false;
	winning_positions = new Array();
	winner_total.count = 0;
	mark(i, key, board_size);
	winning_positions.sort();
	if(winner_total.count >= 3){
		return true;
	}else if(winner_total.count === 2){
		almost_win = true;
	}
	
	winning_positions = new Array();
	winner_total.count = 0;
	mark_horizontal(i, key, -1, board_size-1);
	mark_horizontal(i, key, 1, 0);
	winning_positions.sort();
	if(winner_total.count >= 3){
		return true;
	}else if(winner_total.count === 2){
		almost_win = true;
	}
	
	winning_positions = new Array();
	winner_total.count = 0;
	if((i%board_size) != 0){
		mark_horizontal(i, key, board_size-1, board_size-1);
	}
	if((i%board_size) != (board_size-1)){
		mark_horizontal(i, key, -board_size+1, 0);
	}
	winning_positions.sort();
	if(winner_total.count >= 3){
		return true;
	}else if(winner_total.count === 2){
		almost_win = true;
	}
	
	winning_positions = new Array();
	winner_total.count = 0;
	if((i%board_size) != (board_size-1)){
		mark_horizontal(i, key, board_size+1, 0);
	}
	if((i%board_size) != 0){
		mark_horizontal(i, key, -board_size-1, board_size-1);
	}
	winning_positions.sort();
	if(winner_total.count >= 3){
		return true;
	}else if(winner_total.count === 2){
		almost_win = true;
	}
	return false;
}

function mark(i, key, direction){
	if((i < (board_size*board_size) - board_size) && board[i + direction] === key){
			winner_total.count++;
			winning_positions.push(i);
			return mark(i+direction, key, direction);
	}else{
		winning_positions.push(i);
		return;
	}
}
function mark_horizontal(i, key, direction, cap){
	
	if( (((i+direction)%board_size) != cap) && (board[i + direction] === key)){
			winner_total.count++;
			winning_positions.push(i);
			mark_horizontal(i+direction, key, direction, cap);
	}else{
		winning_positions.push(i);
		return;
	}
}
function ai_move(){

	var almost_move  = 0;
	var not_there = 0;
	var count = 0;
	var almost_count = 0;
	var array_almost_wins = {
		count: 0,
		i: 0
	};
	if(num_moves < 4){
		var counter_block = 0;
		for(var jjj = 0; jjj < board_size; jjj++) {
			for (var iii = 0; iii < board_size; iii++) {
				if(board[counter_block] === 1){
					if((counter_block-1)% board_size != 0 &&
						(counter_block-1)%board_size != board_size -1 &&
						board[counter_block-1] === 0){
						if(check_winner(drop_tile("#65C665", iii-1, -1), -1)){
							winner = true;
							play_song = true;
							update_robo_win();
							return;
						}
						player_red = true;
						drop_zone_block.color = "E77676";
						var t=setTimeout("unblock()", 800);
						
						player_red = true;
						return;
					}else if((counter_block+1)% (board_size) != board_size-1 && board[counter_block+1] === 0){
						if(check_winner(drop_tile("#65C665", iii+1, -1), -1)){
							winner = true;
							play_song = true;
							update_robo_win();
							return;
						}
						player_red = true;
						drop_zone_block.color = "E77676";
						var t=setTimeout("unblock()", 800);
						
						player_red = true;
						return;
					}
				}
				counter_block++;
			}
		}
	}
	for(var j = 0; j < board_size; j++) {
		for (var i = 0; i < board_size; i++) {
			if(board[count] === 0){
				board[count] = -1;
				if(check_winner(count, -1)){
					if(board[count%board_size] === 0){
						 if(board[count+board_size] === 0){
							not_there=i;
						 }else{
							board[count] = 0;
							if(check_winner(drop_tile("#65C665", i, -1), -1)){
								winner = true;
								play_song = true;
								update_robo_win();
								return;
							}
							player_red = true;
							drop_zone_block.color = "E77676";
							var t=setTimeout("unblock()", 800);
							
							player_red = true;
							return;
						}
					}
				}else if(almost_win){
					almost_move = array_almost_wins.i;
					almost_count = array_almost_wins.count;
				}
				board[count] = 0;
			}
			count++;    
		}
	}
	
	count = 0;
	for (j = 0; j < board_size; j++) {
		for (i = 0; i < board_size; i++) {
			if(board[count] === 0){
				board[count] = 1;
				if(check_winner(count,1)){
					board[count] = 0;
					if(board[count%board_size] === 0 && 
					   board[count+board_size] != 0){
						if(check_winner(drop_tile("#65C665", i, -1), -1)){
							winner = true;
							update_robo_win();
							play_song = true;
							return;
						}
						var t=setTimeout("unblock()", 800);
						player_red = true;
						drop_zone_block.color = "E77676";
						return;
					}
				}
				board[count] = 0;
			}
			count++;
		}
	}	
	

	
	if(almost_win){
		if(board[array_almost_wins.count%board_size] === 0 && 
		   board[array_almost_wins.count+board_size] != 0 &&
		   array_almost_wins.count%board_size === not_there){
		   
			board[array_almost_wins.count] = 0;
			if(check_winner(drop_tile("#65C665", array_almost_wins.i, -1), -1)){
				winner = true;
				update_robo_win();
				play_song = true;
				return;
			}
			player_red = true;
			drop_zone_block.color = "E77676";
			var t=setTimeout("unblock()", 800);
			player_red = true;
			return;
		}
	}
	
	
	var t=setTimeout("unblock()", 800);
	var randomnumber;
	do{
		randomnumber = Math.floor(Math.random()*board_size);
	}while(board[randomnumber] != 0);
	if(check_winner(drop_tile("#65C665", randomnumber, -1), -1)){
		winner = true;
		update_robo_win();
		play_song = true;
		return;
	}
	player_red = true;
	drop_zone_block.color = "E77676";
}
function unblock(){
	block_move = false;
	num_moves++;
	drop_zone_block.color = "E77676";
	drop();
	if(num_moves >= board_size*board_size && !winner){
		new_game();
	}
}
function drop_tile(color_in, i, key){
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
		x: row*tile_size,
		y: 0,
		vx: 0,
		vy: 0,
		width: tile_size-9,
		height: tile_size-10,
		animate_to: counter*tile_size,
		to_animate: true,
		key: i,
		color: color_in
	};
	board[i] = key;
	return i;
}
function update_robo_win(){
	var increase = parseInt(localStorage.getItem("robo_w"));
	increase++;
	
	localStorage.setItem("robo_w", increase);
	document.getElementById('robo_wins').innerHTML = increase;
}
function update_player_win(){
	var increase = parseInt(localStorage.getItem("player_w"));
	increase++;
	
	localStorage.setItem("player_w", increase);
	document.getElementById('player_wins').innerHTML = increase;
}
function reset_game(){
	reset_animation = true;
}
