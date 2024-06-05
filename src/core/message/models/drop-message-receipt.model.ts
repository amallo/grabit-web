import { createEntityAdapter } from "@reduxjs/toolkit"

export interface DropMessageReceipt{
    id: string
    validUntil: string
    droppedAt: string
}

export interface Deposit{
    id: string
    validUntil: string
    at: string
}


class DepositBuilder {
    validUntil!: string
    at!: string
    constructor(private id: string){}
    withAt(at: string){
      this.at = at  
      return this
    }
    withvalidUntil(until: string){
        this.validUntil = until  
        return this
      }

    build() : Deposit{
        return {
            id: this.id,
            at: this.at,
            validUntil: this.validUntil
        }
    }
}

export const deposit = ({id, at = '', validUntil = ''} : Deposit)=>{
    return new DepositBuilder(id).withAt(at).withvalidUntil(validUntil)
}

export const depositAdapter = createEntityAdapter<Deposit>()