import "./Pagination.scss"

interface PaginationProps {
    productsPerPage: number
    totalProduct: number
    paginate: (number: number) => void
}

function Pagination({productsPerPage, totalProduct, paginate}: PaginationProps) {

    const pageNumber = []

    for (let i = 1; i <= Math.ceil(totalProduct / productsPerPage); i++) {
        pageNumber.push(i)
    }

    return(
        <>
            <ul className="pagination_ul">
                {
                    pageNumber.map(number => (
                        <a href="#" key={number} onClick={() => paginate(number)}>
                            <li className="pagination_ul_li" >
                                {number}
                            </li>
                        </a>
                    ))
                }
            </ul>
        </>
    )
}

export default Pagination