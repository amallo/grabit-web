import { HttpGateway } from "../http.gateway";

export class FetchHttpGateway implements HttpGateway{
    constructor(private host: string){}

    private async req<Req = unknown, Res = unknown>(path: string, body: Req, method: string): Promise<Res> {
        const result = await fetch(this.host + path, {
            body: body ? JSON.stringify(body) : undefined,
            method,
            headers: {
                "Content-Type": "application/json",
            }
        })
        if (result.ok){
            return result.json()
        }
        const error = await result.json()
        throw error
    }
    async post<Req = unknown, Res = unknown>(path: string, body?: Req): Promise<Res> {
        return this.req(path, body, "POST")
    }
    async put<Req = unknown, Res = unknown>(path: string, body?: Req): Promise<Res> {
        return this.req(path, body, "PUT")
    }
    
}