import { MotionRegistry, TargetedAnimation } from './interfaces.js';
/**
 *
 * The ClarityMotion service is a static class that gives users the ability to retrieve
 * and override animation configurations based on the Web Animations API that are targeted
 * at a CSS selector defined in the configuration.
 *
 */
export declare class ClarityMotion {
    /**
     * Returns a readonly reference of the registry of animations.
     */
    static get registry(): Readonly<MotionRegistry>;
    static has(name: string): boolean;
    static get(name: string): TargetedAnimation[];
    static add(animationName: string, animationConfig: TargetedAnimation[]): void;
}
