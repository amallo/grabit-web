import { FormControl, FormLabel, Textarea, FormHelperText, Button, useToast } from "@chakra-ui/react"
import { useState } from "react"
type Props = {
  receiptId: string
}
type GrabStatus = "ready"| "destroyed"
export const GrabFormControl = ({receiptId}: Props)=>{
    const [grabStatus, setGrabStatus] = useState<GrabStatus>("ready")
    const grab = ()=>{
      setGrabStatus("destroyed")
      setTimeout(()=>{
        toast({
          title: 'Félicitations !',
          description: `Le message ${receiptId} a bien été lu. Vous pouvez maintenant le copier/coller pour le conserver.`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }, 300)
      

    }
    const toast = useToast()
    return <FormControl gap={16} flex={1}>
              {grabStatus === "ready" && <FormLabel flex={1}>Lire et détruire le message {receiptId} ?</FormLabel>}
              {grabStatus === "destroyed" && <FormLabel flex={1}>Le message {receiptId} a bien été lu et n'est plus accessible.</FormLabel>}
              { grabStatus === "ready" && 
                <div style={{flex:1, gap:16, display: 'flex', justifyContent: 'space-between'}}>
                  <Button flex={1} colorScheme='teal' onClick={()=>grab()}>Oui je suis prêt !</Button>
                  <Button flex={1} colorScheme='gray'>Non pas encore</Button>
                </div>
              }
              { grabStatus === "destroyed" && 
                <>
                  <Textarea value={"This is the end"} disabled backgroundColor={"Highlight"}  />
                </>
              }
          </FormControl>
}