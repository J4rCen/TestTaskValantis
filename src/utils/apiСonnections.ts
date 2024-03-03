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
        const request = {action: "get_ids", params: {"limit": 1000}}
        return await this.connections(request)
        
    }

    private filter = async(filter: string | undefined, parameter: number | string | undefined) => {
        const params = JSON.parse(`{"${filter}": ${filter === "price" ? parameter : `"${parameter}"`}}`)
        const request = {action: "filter", params: params}
        return await this.connections(request)
        
    }

    private connections = async(request: requestApiProps) => {
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

        return await fetch(this.URL_REQUEST, options).then(async res => await res.json())
    }

    getProducts = async(filterSetting?: filterSettingProps, repeatedRequest: number = 20) => {
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
