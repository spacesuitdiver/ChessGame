import Piece from './piece';

class Queen extends Piece {
    constructor(player) {
        super(player, (player === 1 ? 'https://upload.wikimedia.org/wikipedia/commons/4/49/Chess_qlt60.png' : 'https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png'))
        this.intialPositions = {
            1: [[3, 7]],
            2: [[3, 0]]
        }
        this.label = 'queen'
    }
}

export default Queen;