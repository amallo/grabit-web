import { createAppAsyncThunk } from "../../create-core-thunk"


export type GrabMessageFailure = {depositId:string, failWith: "GATEWAY_ERROR"}
export const grabMessage = createAppAsyncThunk(
    "messages/grab",
    async (
      {receipt}: { receipt: string },
      { extra: { messageGateway }, rejectWithValue }
    ) => {
        try{
            return await messageGateway.grab(receipt)
        }
        catch(e){
            return rejectWithValue({depositId:receipt, failWith: "GATEWAY_ERROR"})
        }
    }
  );
  