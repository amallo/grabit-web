export interface HttpGateway{
    post<Req=unknown, Res=unknown>(path: string, body: Req): Promise<Res>
    put<Req=unknown, Res=unknown>(path: string, body?: Req): Promise<Res>
}