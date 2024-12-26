export default class StringUtils {
    public static format(formatString: string, variables: string[]): string {
        return formatString.replace(/{(\d+)}/g, function (match, index) {
            return typeof variables[index] != 'undefined' && typeof index === 'number' ? variables[index] : match;
        });
    }
}
