import { useEffect, useState } from "react"
import {productProps} from "../interface/productProps"
import "./App.scss"
import CardProduct from "../components/card_product/CardProduct"
import Pagination from "../components/pagination"
import apiСonnections from "../utils/apiСonnections"

function App() {
  const [loading, setLoading] = useState(false)
  const [productsState, setProductsState] = useState(Array<productProps>)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(50)
  const [parameter, setsearchText] = useState('')
  const [filter, setSelectTypeSearch] = useState('noFilter')
  const [filterSetting, setFilterSetting] = useState(Object)

  useEffect(() => {

    const setProduct = async () => {
      setLoading(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any | Array<productProps> = await apiСonnections.getProducts(filterSetting)
      setProductsState(res === undefined ? [] : res)
      setCurrentPage(1)
      setLoading(false)
    } 
    setProduct()
    
  }, [filterSetting])

  const lastIndex = currentPage * productsPerPage
  const firstIndex = lastIndex - productsPerPage
  const currentProduct = productsState.slice(firstIndex, lastIndex)

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()

    if(filter === "noFilter" || parameter !== '') {
      setFilterSetting({filter, parameter})
    } else {
      alert("Заполните поле поиска")
    }
    
    setsearchText('')
  }

  return (
    <div className="app_div">
      <div className="app_filter_div">
        <form action="search" onSubmit={handleSubmit}>
            <input name="search" type="text" value={parameter} onChange={el => setsearchText(el.target.value)} placeholder="Введите значение"/>
            <input type="submit" value={"Поиск"}/>
            <div>
              <select value={filter} onChange={el => setSelectTypeSearch(el.target.value)}>
                <option value="noFilter">Без фильтра</option>
                <option value="brand">Бренд</option>
                <option value="price">Цена</option>
                <option value="product">Продукт</option>
              </select>
            </div>
        </form>
      </div>
      <div className="app_cardProduct_div">
        <CardProduct productProps={currentProduct} loading={loading}/>
      </div>
      <div className="app_pagination_div">
        <Pagination 
          productsPerPage={productsPerPage} 
          totalProduct={productsState.length}
          paginate={paginate} 
        />
      </div>  
    </div>
  )
}

export default App
