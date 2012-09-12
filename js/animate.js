 window.requestAnimFrame = (function(callback){
                return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback){
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
            
            function update_rectangle(rect_in){
				ctx.fillStyle = rect_in.color;
				ctx.lineWidth = 5;
				ctx.shadowOffsetX = 3;
				ctx.shadowOffsetY = 3;
				ctx.shadowBlur    = 4;
				ctx.beginPath();
                ctx.rect(rect_in.x, rect_in.y, rect_in.width, rect_in.height);
				ctx.stroke();
                ctx.fill();
            }
            function animate(last_time){
				//This black magic math will handle gravity
				var date = new Date();
				var time = date.getTime();
				var time_difference = time - last_time;
				var gravity = 2;
				var speed_inc = gravity * time_difference / 1000;
				
				//for each block in falling blocks, see if it is
				// animatable.  If so, animate, if not, draw it.
				if(!winner || !last_done){
					
					ctx.clearRect(0, 0, canvas1.width, canvas1.height);
					draw_board();
					for(var i =0; i < blocks.length; i++){
						if(blocks[i].to_animate){
							if(blocks[i].y < blocks[i].animate_to){
								blocks[i].vy += speed_inc;
								blocks[i].y += (blocks[i].vy * time_difference);
							}else{
								if(winner && !last_done && i === blocks.length -1){
									last_done = true;
								}
								blocks[i].y = blocks[i].animate_to;
								blocks[i].to_animate = false;
							}
						}
						update_rectangle(blocks[i]);
					}
					last_time = time;
					requestAnimFrame(function(){
						animate(last_time);
					});
				}else{
					var counter = 0;
					var w_count = 0;
					for(var jj = 0; jj < board_size; jj++){
						for(var ii = 0; ii < board_size; ii++){
							if(counter === winning_positions[w_count]){
									//removing duplicates
								if(winning_positions[w_count] === winning_positions[w_count+1]){
									winning_positions.splice(w_count+1, 1);
								}
								//draw_board();
								ctx.strokeStyle = "#fff";
								ctx.strokeRect(ii*tile_size+(tile_size/10), jj*tile_size+(tile_size/10), tile_size*.8, tile_size*.8);
								ctx.stroke();
								w_count++;
							}
							counter++;
						}
					}
				}
			}
			function get_mouse_position(event) {
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
				drop_zone_block.x = x;
				drop();
				
			}
			function drop(){
				ctx2.clearRect(0, 0, 402, 50);
				ctx2.lineWidth = 1
				ctx2.shadowOffsetX = 3;
				ctx2.shadowOffsetY = 3;
				ctx2.shadowBlur    = 4;
				ctx2.fillStyle = drop_zone_block.color;
				ctx2.beginPath();
				ctx2.moveTo(drop_zone_block.x, 10);
				ctx2.lineTo(drop_zone_block.x -10,0);
				ctx2.lineTo(drop_zone_block.x + 10, 0);
				ctx2.closePath();
				ctx2.fill();
				ctx2.stroke();
			}
			
 