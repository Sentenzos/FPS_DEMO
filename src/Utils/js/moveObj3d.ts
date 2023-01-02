import {Object3D} from "three";

type MoveArgsType = {
    posObject: typeof Object3D.prototype.position,
    axis: 'x' | 'y' | 'z',
    operator: '+' | '-',
    step: number,
    idContainer: any,
    idName: string
}

export function moveObj3d (obj: MoveArgsType): void {
    const { posObject, axis, operator, step, idContainer, idName } = obj;
    const args: MoveArgsType = arguments[0];
    console.log('...')
    if (operator === '+') posObject[axis] += step;
    else if (operator === '-') posObject[axis] -= step;

    idContainer[idName] = requestAnimationFrame(() => moveObj3d({...args}));
}


