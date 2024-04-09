type CausedBy = "GATEWAY_ERROR"
export interface Err{
    code: string
    causedBy: string
    message: string
}

export const makeErr = (code: string, causedBy: CausedBy, causedByError: Error): Err=>{
    return {
        code,
        causedBy,
        message: causedByError.message
    }
}