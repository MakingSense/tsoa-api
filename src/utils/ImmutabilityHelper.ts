export class ImmutabilityHelper {
  public static getType(variable: any): string {
    let type: string = typeof variable;
    type = variable === null ? 'null' : type;
    type = Array.isArray(variable) ? 'array' : type;
    return type;
  }

  public static immute<T>(variable: any): T {
    let copy: T;
    const variableType: string = ImmutabilityHelper.getType(variable);

    if (variableType === 'object') copy = { ...variable };
    else if (variableType === 'array') copy = variable.slice();
    else copy = variable;

    return copy as T;
  }

  public static copy<T>(variable: any): T {
    const result: T = ImmutabilityHelper.immute(variable) as T;

    const loop = (value: any): any => {
      const valueType: string = ImmutabilityHelper.getType(value);
      const loopable: boolean = !!(valueType === 'object' || valueType === 'array');
      const loopHandler = (index) => {
        value[index] = ImmutabilityHelper.immute(value[index]);
        if (loopable) loop(value[index]);
      };

      if (valueType === 'object') for (const index in value) loopHandler(index);
      if (valueType === 'array') for (let index = 0; index < value.length; index++) loopHandler(index);
    };

    loop(result);

    return result as T;
  }

  constructor() { throw new Error('just don\'t...'); }
}
