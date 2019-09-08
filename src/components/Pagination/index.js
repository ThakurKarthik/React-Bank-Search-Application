import React from 'react'
import './pagination.css'

class Pagination extends React.Component {
    render() {
        const buttons = []
        for (let pageNumber = 1; pageNumber <= this.props.numberOfPages;pageNumber++) {
            buttons.push(
                <button key={pageNumber} 
                    onClick={() => this.props.updateCurrentPage(pageNumber)} 
                    className={this.props.currentPage===pageNumber?'active-page':'page-button'}
                >
                    {pageNumber}
                </button>
            )
        }
        return (
            <div className="pagination-container">
                <span className="page-size">Page size</span>
                <select onChange={event=>this.props.updatePageSize(event.target.value)} className="page-size-dropdown">
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                </select>
                <button 
                    className="view-favorite" 
                    onClick={this.props.showFavorites}
                    style={{
                        backgroundColor:this.props.favoriteItemCount>0?'tomato':null,
                    }}
                    disabled={this.props.favoriteItemCount===0}
                >
                    Show Favorites
                </button>
                <div className="pagination-bar">
                <span className="page-size">Jump To </span>
                    {
                        buttons
                    }
                </div>
            </div>
        )
    }
}

export default Pagination