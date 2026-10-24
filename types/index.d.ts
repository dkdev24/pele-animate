export interface AnimateOptions {
  /** Element that triggers the hover token animation. Default: the svg itself. */
  hover?: Element;
  /** The Mermaid source, read for `%% pa:` pins. */
  source?: string;
}

export interface WatchOptions {
  /** `false` keeps the old click-to-replay instead of step mode. Default `true`. */
  controls?: boolean;
}

/** One step: the elements that appear and, for each, the parts that pop in. */
export type PaStep = Array<[element: Element, parts: Element[]]>;

declare global {
  interface SVGSVGElement {
    /** Set by `animate()`: one array per step. */
    paSteps?: PaStep[];
  }
}

/** Read the `%% pa:` pins: node id, or `'X>Y'` for an edge, to a 0-based step. */
export function parseOrder(source?: string): Map<string, number>;

/** Animate one rendered Pele svg (flowchart or sequence diagram). */
export function animate(svg: SVGSVGElement, options?: AnimateOptions): void;

/** Animate every svg Pele renders into `container`, re-applying after Pele re-lays-out on resize. */
export function watch(container: HTMLElement, source?: string, options?: WatchOptions): void;

/** Play the intro again. */
export function replay(svg: SVGSVGElement | null | undefined): void;
