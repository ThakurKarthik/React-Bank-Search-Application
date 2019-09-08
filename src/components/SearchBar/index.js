import React from 'react'
import './searchbar.css'
class SearchBar extends React.Component{
    state={
        // banks:[],
        city:"MUMBAI"
    }
    fetchBanks=city=>{
        fetch(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
        .then(res=>res.json()).then(bankData=>this.props.updateBankList(bankData,city)).catch(err=>console.error('Error',err));
    }
    updateCity=event=>{
        this.setState({
            city:event.target.value
        })
    }
    componentDidMount(){
        this.fetchBanks(this.state.city)
    }
    componentDidUpdate(prevProps,prevState){
        if(prevState.city!==this.state.city){
            if(!(this.props.citiesDataCache.length>0 && this.props.citiesDataCache.find(bankCityObject=>bankCityObject['city']===this.state.city))){
                this.fetchBanks(this.state.city)
            }else{
                this.props.updateBankList(null,this.state.city)
            }
        }
    }
    render(){
        return(
            <div className="container">
                <input 
                    className="search-input" 
                    placeholder="search banks by text"
                    onChange={e=>this.props.filterBanks(e.target.value)}
                    ref={node=>this.searchInputRef=node}
                />
                <select 
                    onChange={this.updateCity} 
                    className="city-dropdown" 
                    value={this.state.city}
                    ref={node=>this.cityDropdownRef=node}
                >
                    <option value="MUMBAI">MUMBAI</option>
                    <option value="HYDERABAD">HYDERABAD</option>
                    <option value="DELHI">DELHI</option>
                    <option value="BENGALURU">BENGALURU</option>
                    <option value="KOLKATA">KOLKATA</option>
                </select>
            </div>
        )
    }
}

export default SearchBar