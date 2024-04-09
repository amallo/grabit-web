import { DateProvider } from "./date.prodivder";

export class RealDateProvider implements DateProvider{
    now(): string {
        return new Date().toISOString()
    }
    
}