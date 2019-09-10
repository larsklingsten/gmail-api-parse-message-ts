export class Snippets {

    /** remove non printing chars, space, intended for use for string comparison with multilines  */
   public static removeNonPrint(s: string): string {
        return s.replace(/[^A-Za-zæøåÆØÅ0-9$§!"#€%&/\[\]\?{}()<>=@,.;':]/g, '');
    };

}