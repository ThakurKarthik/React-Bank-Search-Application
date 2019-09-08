function setItem(data){
    console.table(data)
    try{
        let favorites=JSON.parse(localStorage.getItem('favorites')) ||[]
        const indexOfData=favorites.findIndex(bankData=>bankData.ifsc===data.ifsc)
        if(indexOfData!==-1){
            favorites.splice(indexOfData,1)
        }else{
            favorites.push(data)
        }
        localStorage.setItem('favorites',JSON.stringify(favorites))
    }catch(error){
        console.log('Error while getting favorites',error)
    }
}

function getItems(){
    const bankDataFavorited=JSON.parse(localStorage.getItem('favorites'))
    return bankDataFavorited||[]
}

export {setItem,getItems}