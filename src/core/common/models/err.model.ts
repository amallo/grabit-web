
export interface Err{
    code: string
    causedBy: string
    message: string
}

export const makeErr = (code: string, causedBy: string, causedByError: Error): Err=>{
    return {
        code,
        causedBy,
        message: causedByError.message
    }
}