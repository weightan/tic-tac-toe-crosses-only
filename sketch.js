const sumRow = (previousValue, currentValue) => previousValue + currentValue;
const arrayColumn = (arr, n) => arr.map(x => x[n]);

let h = 400;
let radio;
let you = 0;
let not_you = 0;
let mode = 1;

let L = (h / 4);
let game;

function setup() {

	radio = createRadio();
    radio.option( 'hard mode');
    radio.option('easy mode');
    //radio.style('width', '60px');
	radio.selected('easy mode')
	
	radio.style('width', '90px');
	// padding-left: 25px;
	
	// position: relative;
	radio.position(20, 20);
	
	createCanvas(h + 100, h + 100);
	background(250);

	
	
	game = new TicTic4();
	game.display();

}

function draw() {
	//setTimeout(function(){test_bots() }, 200); 
}


class TicTic4 {

	constructor() {
		this.grid = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	}

	turn(x, y) {
		this.grid[x][y] = 1;
	}

	// 	diagonalSums() {
	// 		let matrix = this.grid;

	// 		let mainSum = 0,
	// 			secondarySum = 0;
	// 		for (let row = 0; row < matrix.length; row++) {
	// 			mainSum += matrix[row][row];
	// 			secondarySum += matrix[row][matrix.length - row - 1];
	// 		}
	// 		return ([mainSum, secondarySum]);

	// 	}

	check_row(arr) {
		let len_arr = arr.length;
		//print(arr)

		for (let i = 0; i < len_arr - 2; i++) {
			if (arr[i] + arr[i + 1] + arr[i + 2] == 3) {
				return (true)
			}
		}

		return (false);
	}

	check_win(temp_grid) {

		if (temp_grid == null) {
			temp_grid = this.grid
		}



		for (let i = 0; i < 4; i++) {
			if (this.check_row(temp_grid[i])) {
				return (true)
			}
		}

		for (let i = 0; i < 4; i++) {
			if (this.check_row(arrayColumn(temp_grid, i))) {
				return (true)
			}
		}

		if (this.check_row([temp_grid[0][0], temp_grid[1][1], temp_grid[2][2], temp_grid[3][3]])) {
			return (true)
		}

		if (this.check_row([temp_grid[3][0], temp_grid[2][1], temp_grid[1][2], temp_grid[0][3]])) {
			return (true)
		}

		if (temp_grid[1][0] + temp_grid[2][1] + temp_grid[3][2] == 3) {
			return (true)
		}

		if (temp_grid[2][0] + temp_grid[1][1] + temp_grid[0][2] == 3) {
			return (true)
		}

		if (temp_grid[0][1] + temp_grid[1][2] + temp_grid[2][3] == 3) {
			return (true)
		}

		if (temp_grid[3][1] + temp_grid[2][2] + temp_grid[1][3] == 3) {
			return (true)
		}

		return (false)

	}

	make_move_random() {
		let t = []
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.grid[i][j] == 0) {
					t.push([i, j])
				}
			}
		}
		this.turn(...random(t))
	}

	return_possible_moves(t_grid) {
		let t = []

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (t_grid[i][j] == 0) {
					t.push([i, j])
				}
			}
		}
		return (t)
	}

	return_possible_moves_not_lose(t_grid) {
		let t = this.return_possible_moves(t_grid);
		let out = []
		t = shuffle(t);
		let min_m = (t.length == 0) ? [] : t[0];
		let score = 100;

		for (let i = 0; i < t.length; i++) {
			let pos = t[i]
			t_grid[pos[0]][pos[1]] = 1;
			let t_sc = this.eval_best_move(t_grid)
			if (!this.check_win() && t_sc < score) {
				min_m = pos
				score = t_sc
			}
			t_grid[pos[0]][pos[1]] = 0;
		}
		//print(score)
		return (min_m)
	}
	
	return_possible_moves_not_lose_all(t_grid) {
		let t = this.return_possible_moves(t_grid);
		let out = []
		t = shuffle(t);
		
		let score = 100;

		for (let i = 0; i < t.length; i++) {
			let pos = t[i]
			t_grid[pos[0]][pos[1]] = 1;
			
			if (!this.check_win() ) {
				out.push(pos)
			}
			t_grid[pos[0]][pos[1]] = 0;
		}
		
		return (out)
	}
	
	
	eval_best_move(t_grid){
		//less good moves
		let t = this.return_possible_moves(t_grid);
		let out = []

		t = shuffle(t);

		for (let i = 0; i < t.length; i++) {
			let pos = t[i]
			t_grid[pos[0]][pos[1]] = 1;
			if (!this.check_win()) {
				out.push(pos)
			}
			t_grid[pos[0]][pos[1]] = 0;
		}
		return (out.length)
		
	}

	tree_search(t_grid, move, nturn){
		//if (nturn > 4){return(0)}
		
		t_grid[move[0]][move[1]] = 1;
		
		let moves = this.return_possible_moves_not_lose_all(t_grid)
		
		if (moves.length > 4 ){moves = moves.slice(4)}
		
		if (moves.length == 0 && nturn%2 == 0){t_grid[move[0]][move[1]] = 0;return(1)}
		if (moves.length == 0 && nturn%2 == 1){t_grid[move[0]][move[1]] = 0;return(0)}
		
		let s = 0;
		for (let i = 0; i < moves.length; i++) { 
			s += this.tree_search(t_grid, moves[i], nturn+1)
		}
		
	
		t_grid[move[0]][move[1]] = 0;
		return(s)
		
	}	
	
	make_move_not_lose() {

		

		let top_move = this.return_possible_moves_not_lose(this.grid)

		if (top_move.length != 0) {
			
			this.turn(...top_move)
		} else {
			let t = this.return_possible_moves(this.grid);
			this.turn(...t[0])
		}

// noprotect

	}
	
	make_best_move(){
		let moves = this.return_possible_moves_not_lose_all(this.grid)
		let maxsc = 0;
		let best_m = moves[0]
				
		if (moves.length > 1) {
			for (let i = 0; i < moves.length; i++) { 
				let score = this.tree_search(this.grid, moves[i], 0)
				//print(str(moves[i]) + ' ' + score)
				if (score > maxsc){
					best_m = moves[i];
					maxsc = score;
				}
			}
			this.turn(...best_m)
			
		} else if(moves.length == 1){
			this.turn(...moves[0])
		
		} else {
			let t = this.return_possible_moves(this.grid);
			this.turn(...t[0])
		}
		//print('-----------')
	}

	display() {
		background(250);
		
		

		textSize(16);
		textAlign(CENTER, TOP);
		text('who first puts three crosses in a row loses', 0, 12, width);
		text('       you ' + str(you) + ' : ' + str(not_you) + ' not you', 0, 470, width);

		let r = 10;

		push();

		translate(50, 50)

		strokeWeight(4);
		strokeCap(ROUND);

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (this.grid[j][i] == 1) {
					cross(j * L + L / 2, i * L + L / 2)
				}
			}
		}

		line(L, r, L, h - r)
		line(L * 2, r, L * 2, h - r)
		line(L * 3, r, L * 3, h - r)

		line(r, L, h - r, L)
		line(r, L * 2, h - r, L * 2)
		line(r, L * 3, h - r, L * 3)

		pop();
	}

	turn_fromxy(x, y) {
		let min_vert = [0, 0];
		let min_d = 10000000;

		if (x <= 0 || x >= h || y <= 0 || y >= h) {
			return (false)
		}

		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {

				let d = dist(x, y, i * L + L / 2, j * L + L / 2);

				if (d < min_d) {
					min_d = d;
					min_vert = [i, j]
				}

			}
		}
		if (this.grid[min_vert[0]][min_vert[1]] == 0) {
			this.turn(...min_vert);
		} else {
			return (false)
		}

		return (true)
	}

	del() {
		this.grid = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]
	}

}



function cross(x, y) {

	let efL = L * 0.5 - 15;

	push();

	stroke(111, 20, 0)
	strokeWeight(10);
	strokeCap(ROUND);
	line(x - efL, y - efL, x + efL, y + efL);
	line(x - efL, y + efL, x + efL, y - efL);

	pop();
}

function mousePressed() {
	//radio.position(displayWidth/2, displayWidth/2);

	if (game.turn_fromxy(mouseX - 50, mouseY - 50)) {

		game.display();

		if (game.check_win(null)) {
			print('you lose!');
			not_you += 1;
			setTimeout(function() {
				game.del();
				game.display();
			}, 200);

		} else {

			setTimeout(function() {
				if (radio.value() == 'easy mode'){
				game.make_move_not_lose()
				}else{
				game.make_best_move()
				}
				game.display();
				if (game.check_win(null)) {
					print('you win!');
					you += 1;
					setTimeout(function() {
						game.del();
						game.display();
					}, 200);
				}
			}, 200);
		}

	}
}

// function changeBG() {
//   let val = random(255);
//   background(val);
// }

function windowResized() {
	//radio.style('width', '90px');
	//radio.style('padding-right', str(int(displayWidth/2)) + 'px');
  //radio.position(displayWidth/2, 20);
}


function test_bots() {
	print(10)
	let turnorder = 0;

	while (!game.check_win(null)) {
		turnorder += 1;
		game.make_move_not_lose();
		game.display();

	}
	game.del()

	if (turnorder % 2 == 0) {
		you += 1
	} else {
		not_you += 1
	}

}
