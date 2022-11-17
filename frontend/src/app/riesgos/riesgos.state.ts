


export interface Step {

}

export interface RiesgosState {
    scenario: null | 'chile' | 'peru' | 'ecuador';
    chile: Step[],
    ecuador: Step[],
    peru: Step[]
}

export const initialRiesgosState: RiesgosState = {
    scenario: null,
    chile: [],
    ecuador: [],
    peru: []
}
