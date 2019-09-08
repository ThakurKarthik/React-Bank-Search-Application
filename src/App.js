import React from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import BankDataTable from "./components/BankDataTable";
import Pagination from "./components/Pagination";
import { setItem, getItems } from "./utils/localStorage";

const getNumberOfPages = function (numberOfBanks, pageSize) {
	const numberOfPages =
		Math.floor(numberOfBanks / pageSize) +
		(numberOfBanks % pageSize === 0 ? 0 : 1);
	return numberOfPages;
};

const isFavorite=function(dataItem,favoritesData){
	const isItemPresent=favoritesData.find(favoriteData=>favoriteData.ifsc===dataItem.ifsc)
	return !!isItemPresent
}
class App extends React.Component {
	state = {
		banks: [],
		currentPage: 1,
		pageSize: 50,
		numberOfPages: 1,
		banksCount: 0,
		filteredBankList: [],
		showOriginalData: true,
		citiesDataCache: [],
		favoriteItemList: getItems(),
		showFavorites: false
	};

	updateBankData = (bankData, city) => {
		this.searchBarRef.searchInputRef.value = "";
		if (bankData) {
			const numberOfBanks = bankData.length;
			const bankWithFavoriteField = bankData.map(data => ({
				...data,
				favorited: isFavorite(data,this.state.favoriteItemList)
			}));
			this.setState(prevState => {
				const numberOfPages = getNumberOfPages(
					numberOfBanks,
					prevState.pageSize
				);
				const newCacheData=prevState.citiesDataCache.filter(citiesDataObject=>{
					if(city!==citiesDataObject.city){
						return true
					}
					return false
				})
				return {
					banks: bankWithFavoriteField,
					banksCount: numberOfBanks,
					numberOfPages,
					showOriginalData: true,
					citiesDataCache: [
						...newCacheData,
						{ city, banks: bankWithFavoriteField }
					],
					currentPage: 1
				};
			});
		} else {
			this.setState(prevState => {
				const cityBanksCacheObject = prevState.citiesDataCache.find(
					bankCityObject => bankCityObject["city"] === city
				);
				const numberOfBanks = cityBanksCacheObject.banks.length;
				const numberOfPages = getNumberOfPages(
					numberOfBanks,
					prevState.pageSize
				);
				return {
					banks: cityBanksCacheObject.banks,
					banksCount: numberOfBanks,
					numberOfPages,
					showOriginalData: true,
					currentPage: 1
				};
			});
		}
	};

	updatePageSize = pageSize => {
		this.setState(prevState => {
			const numberOfPages = getNumberOfPages(prevState.banksCount, pageSize);
			return {
				pageSize,
				numberOfPages,
				currentPage: 1
			};
		});
	};

	updateCurrentPage = currentPage => {
		this.setState({
			currentPage
		});
	};

	filterBanks = filterText => {
		const { banks, banksCount } = this.state;
		if (filterText) {
			const filteredBankList = [];
			for (let i = 0; i < banksCount; i++) {
				for (const key in banks[i]) {
					if (
						banks[i][key].toString().indexOf(filterText.toUpperCase()) !== -1
					) {
						filteredBankList.push(banks[i]);
						break;
					}
				}
			}
			this.setState(prevState => {
				const numberOfPages = getNumberOfPages(
					filteredBankList.length,
					prevState.pageSize
				);
				return {
					filteredBankList,
					showOriginalData: false,
					numberOfPages,
					currentPage: 1
				};
			});
		} else {
			this.setState(prevState => {
				const numberOfPages = getNumberOfPages(
					prevState.banksCount,
					prevState.pageSize
				);
				return {
					showOriginalData: true,
					numberOfPages,
					currentPage: 1
				};
			});
		}
	};
	updateFavorite = data => {
		const toggleData = { ...data, favorited: !data.favorited };
		this.setState(prevState => {
			const { banks, citiesDataCache,favoriteItemList,showOriginalData,filteredBankList } = prevState;
			let newBankData,newFilteredData
			if(!showOriginalData){
				newFilteredData = filteredBankList.map(bank => {
					if (bank.ifsc === data.ifsc) {
						return toggleData;
					}
					return bank;
				});
				
			}
			newBankData = banks.map(bank => {
				if (bank.ifsc === data.ifsc) {
					return toggleData;
				}
				return bank;
			});

			const newCacheData = citiesDataCache.map(bankCityObject => {
				if (bankCityObject.city === data.city) {
					return {
						...bankCityObject,
						banks: bankCityObject.banks.map(bankObj=>{
							if(bankObj.ifsc===data.ifsc){
								return toggleData
							}
							return bankObj;
						})
					};
				}
				return bankCityObject;
			});
			let newFavoriteItemList=[]
			const indexOfItem=favoriteItemList.findIndex(bankData=>bankData.ifsc===data.ifsc)
			if(indexOfItem===-1){
				newFavoriteItemList=[...favoriteItemList,toggleData]
			}else{
				newFavoriteItemList=favoriteItemList.filter((_,index)=>index!==indexOfItem)
			}
			return showOriginalData ? ({
				banks: newBankData,
				citiesDataCache: newCacheData,
				favoriteItemList: newFavoriteItemList,
			}):({
				banks: newBankData,
				filteredBankList:newFilteredData,
				citiesDataCache: newCacheData,
				favoriteItemList: newFavoriteItemList,
			})
		},()=>{
			setItem(toggleData);
		});
	};

	showFavorites = () => {
		this.setState(prevState => {
			const numberOfPages = getNumberOfPages(
				prevState.showFavorites?prevState.banksCount:prevState.favoriteItemList.length,
				prevState.pageSize
			);
			return {
				showFavorites: !prevState.showFavorites,
				currentPage: 1,
				numberOfPages
			}
		});
	};
	componentDidUpdate(prevProps,prevState){
		if(this.state.favoriteItemList.length===0 && this.state.showFavorites){
			this.setState(prevState=>{
				const numberOfPages = getNumberOfPages(
					prevState.banksCount,
					prevState.pageSize
				);
				return {
					showFavorites:false,
					currentPage:1,
					numberOfPages
				}
			})
		}
	}
	render() {
		const {
			banks,
			currentPage,
			pageSize,
			showOriginalData,
			filteredBankList,
			favoriteItemList,
			showFavorites
		} = this.state;
		let data;
		if (showOriginalData)
			data = banks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
		else
			data = filteredBankList.slice(
				(currentPage - 1) * pageSize,
				currentPage * pageSize
			);
		if (showFavorites && favoriteItemList.length>0) {
			data = favoriteItemList.slice(
				(currentPage - 1) * pageSize,
				currentPage * pageSize
			);
		}
		return (
			<div>
				<header className="App-Header">Bank Search Application</header>
				<SearchBar
					citiesDataCache={this.state.citiesDataCache}
					updateBankList={this.updateBankData}
					filterBanks={this.filterBanks}
					ref={searchBarRef => (this.searchBarRef = searchBarRef)}
				/>
				<Pagination
					updatePageSize={this.updatePageSize}
					numberOfPages={this.state.numberOfPages}
					updateCurrentPage={this.updateCurrentPage}
					currentPage={currentPage}
					showFavorites={this.showFavorites}
					favoriteItemCount={this.state.favoriteItemList.length}
				/>
				<BankDataTable
					data={data}
					currentPage={currentPage}
					pageSize={pageSize}
					updateFavorite={this.updateFavorite}
				/>
				<div className="attribution-text">
					Icons made by{" "}
					<a
						href="https://www.flaticon.com/authors/smashicons"
						title="Smashicons"
						className="attribution-link"
					>
						Smashicons
					</a>{" "}
					from{" "}
					<a
						href="https://www.flaticon.com/"
						title="Flaticon"
						className="attribution-link"
					>
						www.flaticon.com
					</a>
				</div>
			</div>
		);
	}
}

export default App;
