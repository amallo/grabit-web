import { IdGenerator } from "./id.generator";

export class FakeIdGenerator implements IdGenerator{
    _willGenerate! : string
    willGenerate(id: string){
        this._willGenerate = id
    }
    generate(): string {
        return this._willGenerate
    }
}