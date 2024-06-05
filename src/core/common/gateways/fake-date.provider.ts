import { DateProvider } from "./date.prodivder";

export class FakeDateProvider implements DateProvider{
    private _now: Date = new Date("2024-04-04T07:52:19.000Z")

    nowIs(date: Date): void {
        this._now = date
    }
    now(): string {
        return this._now.toISOString()
    }
    
}