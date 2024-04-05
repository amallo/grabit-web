import { DateProvider } from "./date.prodivder";

export class FakeDateProvider implements DateProvider{
    private _now!: Date

    nowIs(date: Date): void {
        this._now = date
    }
    now(): string {
        return this._now.toISOString()
    }
    
}