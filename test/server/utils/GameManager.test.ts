import GameManager, { Point } from '../../../src/server/GameManager';

describe('Main board is successfully generated', () => {
    let expectedEdges = 10

    let gm = new GameManager(expectedEdges);
    let borderPoints = gm.generateBorder();

    test(`Generated number of points should be equal to ${expectedEdges}`, () => 
        expect(borderPoints.length).toBe(expectedEdges)
    );

    test('All board points should be set to a valid point', () => 
        expect(borderPoints.includes(undefined!)).toBeFalsy()
    );

    test('Shape should represent a simple, non-intersecting polygon', () =>
        expect(isPolygonComplex(borderPoints)).toBeFalsy()
    );
});

function isPolygonComplex(points: Point[]) {
    // Create an array of line segments from the points
    const segments: {start: Point, end: Point}[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      segments.push({ start: points[i], end: points[i + 1] });
    }
    // Add last segment
    segments.push({ start: points[points.length - 1], end: points[0] });
  
    // Sort the line segments by their x-coordinate
    segments.sort((a, b) => a.start.x - b.start.x);
  
    // Initialize the sweep line and the event queue
    const sweepLine = new Set<typeof segments[0]>();
    const eventQueue: {type: string, point: Point, segment: typeof segments[0]}[] = [];
  
    // Add the start and end points of each line segment to the event queue
    for (const segment of segments) {
      eventQueue.push({ type: 'start', point: segment.start, segment });
      eventQueue.push({ type: 'end', point: segment.end, segment });
    }
  
    // Sort the event queue by the x-coordinate of the points
    eventQueue.sort((a, b) => a.point.x - b.point.x);
  
    // Process the events in the queue
    while (eventQueue.length > 0) {
        const event = eventQueue.shift()!;
        if (event.type === 'start') {
            // Add the line segment to the sweep line
            sweepLine.add(event.segment);
            // Check for intersections with other line segments on the sweep line
            for (const segment of sweepLine) {
                if (event.segment !== segment && intersects(event.segment, segment)) {
                    return true; // The polygon is complex
                }
            }
        } else {
            // Remove the line segment from the sweep line
            sweepLine.delete(event.segment);
        }
    }
  
    return false; // The polygon is simple
}
  
function intersects(segment1: {start: Point, end: Point}, segment2: {start: Point, end: Point}) {
    // Check if the line segments intersect using the line intersection formula
    const denom = (segment1.end.y - segment1.start.y) * (segment2.end.x - segment2.start.x) - (segment1.end.x - segment1.start.x) * (segment2.end.y - segment2.start.y);
    if (denom === 0) {
        return false; // The line segments are parallel
    }
    const num1 = (segment1.start.x - segment2.start.x) * (segment2.end.y - segment2.start.y) - (segment1.start.y - segment2.start.y) * (segment2.end.x - segment2.start.x);
    const num2 = (segment1.start.x - segment2.start.x) * (segment1.end.y - segment1.start.y) - (segment1.start.y - segment2.start.y) * (segment1.end.x - segment1.start.x);
    const ua = num1 / denom;
    const ub = num2 / denom;
    return ua > 0 && ua < 1 && ub > 0 && ub < 1; // The line segments intersect
}
