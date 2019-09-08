import React from "react";
import like from  '../../like.svg'
import unlike from '../../emptylike.svg'
import './bank-table.css'

class BankDataTable extends React.Component {
    render() {
        const offset=(this.props.currentPage-1)*this.props.pageSize;
		return (
			<div className="bank-table-container">
				<table className="table-layout">
					<thead>
						<tr className="table-header">
                            <th>S.No</th>
                            <th>BANK ID</th>
                            <th>BANK NAME</th>
                            <th>IFSC</th>
                            <th>BRANCH</th>
                            <th>ADDRESS</th>
                            <th>DISTRICT</th>
                            <th>STATE</th>
                            <th>FAVORITE</th>
						</tr>
					</thead>
                    <tbody>
                        {
                            this.props.data.map((data,index)=>(
                                <tr key={data.ifsc}>
                                    <td>{offset+index+1}</td>
                                    <td>{data.bank_id}</td>
                                    <td>{data.bank_name}</td>
                                    <td>{data.ifsc}</td>
                                    <td>{data.branch}</td>
                                    <td>{data.address}</td>
                                    <td>{data.district}</td>
                                    <td>{data.state}</td>
                                    <td>
                                        <div className="favorite-container" onClick={e=>this.props.updateFavorite(data)}>
                                            {data.favorited?<img src={like} alt="Liked" className="fav"/>:<img src={unlike} alt="Unliked" className="fav"/>}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
				</table>
			</div>
		);
	}
}

export default BankDataTable;
