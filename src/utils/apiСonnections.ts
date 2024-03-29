import CryptoJS from "crypto-js"

interface requestApiProps {
    action: string,
    params?: object
}

interface filterSettingProps {
    filter: string | undefined
    parameter: string | undefined
}

class apiConnections {
    
    private PASSWORLD = "Valantis"
    private URL_REQUEST = "https://api.valantis.store:41000/";
    
    private getIds = async() => {
        try {
            const request = {action: "get_ids", params: {"limit": 1000}}
            return await this.connections(request)
            
        } catch (error) {
            console.error(error)
            this.getIds()

        }
        
    }

    private filter = async(filter: string | undefined, parameter: number | string | undefined) => {
        try {
            const params = JSON.parse(`{"${filter}": ${filter === "price" ? parameter : `"${parameter}"`}}`)
            const request = {action: "filter", params: params}
            return await this.connections(request)
        } catch (error) {
            console.error(error)

            this.filter(filter, parameter)
        }
    }

    private connections = async(request: requestApiProps, repeatedRequest: number = 10) => {

        try {
            const nowDate = new Date()
            const tokenAuthentication = CryptoJS.MD5(`${this.PASSWORLD}_${nowDate.getFullYear()}${nowDate.getMonth() + 1 < 10 ? `0${nowDate.getMonth() + 1}` : nowDate.getMonth() + 1}${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : nowDate.getDate()}`).toString()

            const options = {
                method: 'POST', 
                headers: new Headers({ 
                    'Content-Type': 'application/json', 
                    'X-Auth': tokenAuthentication,
                }), 
                body: JSON.stringify( request )
            }

            const res = await fetch(this.URL_REQUEST, options)
            .then(async response => {
                if(!response.ok) {
                    throw new Error('Error occurred!')
                }

                return await response.json()
            })
            .catch(err => {
                console.error(err)

                if(repeatedRequest !== 0) {
                    repeatedRequest -= 1
                    this.connections(request, repeatedRequest)
                }
            })

            if(res.result === undefined) {
                throw new Error("result equals undefined")
            }

            return await res

        } catch (error) {
            console.error(error)

            if(repeatedRequest !== 0) {
                repeatedRequest -= 1
                this.connections(request, repeatedRequest)
            }
        }

    }

    getProducts = async(filterSetting?: filterSettingProps, repeatedRequest: number = 10) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let dataRequest: any = "";
            const isFilter = filterSetting?.filter !== undefined && filterSetting?.filter !== "noFilter";

            if(isFilter) {
                dataRequest = await this.filter(filterSetting?.filter, filterSetting?.parameter)
            }

            if(!isFilter) {
                dataRequest = await this.getIds()
            }
        
            const request = {action: "get_items", params: {"ids": dataRequest.result}}
            const respons = await this.connections(request)

            const answer = new Map()

            respons.result.forEach((el: { id: string; })  => {
                if(!answer.get(el.id)) {
                    answer.set(el.id, el)
                }
            });

            const res = Array.from(answer, ([, value]) => ( value ))

            return res

        } catch (error) {
            console.error(error)

            if(repeatedRequest !== 0) {
                repeatedRequest -= 1
                this.getProducts(filterSetting, repeatedRequest)
            }
        }
    }
}

export default new apiConnections()
