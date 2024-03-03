import "./CardProduct.scss"
import { productProps } from "../../interface/productProps"

interface Props {
    productProps: Array<productProps>
    loading: boolean
}

function CardProduct({productProps, loading}: Props) {

    if(loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            {
                productProps.map(el => 
                    <div key={el.id} className="cardProduct_div">
                        <p className="cardProduct_div_product">{el.product}</p>
                        <p className="cardProduct_div_price">Цена: {el.price}</p>
                        <p className="cardProduct_div_brand">{el.brand}</p>
                        <p className="cardProduct_div_id">{el.id}</p>
                    </div>
                )
            }
        </>
        
    )
}

export default CardProduct;