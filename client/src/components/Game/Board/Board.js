import React from 'react';
import Square from '../Square/Square';
import Piece from '../Piece/Piece';

class Board extends React.Component {

    renderSquare(i, item) {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const black = (x + y) % 2 === 1;
        const piece = item || { icon: null }
        return (
            <div key={i} style={{ width: '12.5%', height: '12.5%' }}
                onClick={this.props.click}>
                <Square black={black}>
                    <Piece icon={piece.icon} label={piece.label} />
                </Square>
            </div>
        )
    }



    render() {
        const squares = []
        for (let i = 0; i < this.props.squares.length; i++) {
            squares.push(this.renderSquare(i, this.props.squares[i]))
        }


        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '500px',
                    height: '500px',
                    marginLeft: '100px',
                    marginTop: '50px',
                    border: '1px solid black'
                }}>
                {squares}
            </div>
        )
    }
}

export default Board;