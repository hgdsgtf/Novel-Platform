import { StyleMessage } from 'Plugins/StyleAPI/StyleMessage'

export class SetHomepageStyleMessage extends StyleMessage {
    stylename: string
    buttoncolor: string
    buttonfontsize: number
    buttonwidth: number
    paragraphfontsize: number
    paragraphcolor: string
    headerfontsize: number
    headercolor: string

    constructor(stylename: string, buttonColor: string, buttonFontSize: number, buttonWidth: number, paragraphFontSize: number, paragraphColor: string, headerFontSize: number, headerColor: string) {
        super()
        this.stylename = stylename
        this.buttoncolor = buttonColor
        this.buttonfontsize = buttonFontSize
        this.buttonwidth = buttonWidth
        this.paragraphfontsize = paragraphFontSize
        this.paragraphcolor = paragraphColor
        this.headerfontsize = headerFontSize
        this.headercolor = headerColor
    }
}