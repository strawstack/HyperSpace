(() => {

    //
    // HELPER
    //

    const qs = s => document.querySelector(s);

    const subv = (a, b) => {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        };
    };

    const copy = d => JSON.parse(JSON.stringify(d));

    function setStyleVar(name, value) {
        document.body.style.setProperty(
            name, `${value}px`
        );
    }

    function backgroundGrid() {
        return ``;
    }

    //
    // VAR
    //
    const {
        width: pageWidth,
        height: pageHeight
    } = document.body.getBoundingClientRect();
    
    setStyleVar("--viewport-width", pageWidth);
    setStyleVar("--viewport-height", pageHeight);

    //
    // STATE
    //
    const state = {
        verticies: {
            // [vid]: {
            //     pos: {x: null, y: null},
            //     data: {
            //         style: {}
            //     },
            //     edges: [eid]
            // }, ...
        },
        edges: {
            // [eid]: {
            //     from: vid,
            //     to: vid,
            //     bidirection: true,
            //     data: {
            //         style: {}
            //     }
            // }, ...
        },
        data: {
            viewBox: {
                minx: 0,
                miny: 0,
                width: pageWidth,
                height: pageHeight,
            },
            aspectRatio: pageWidth / pageHeight,
            pixelRatio: 1,
            zoomStep: 100,
            mouse: {
                pos: {
                    x: 0, 
                    y: 0
                },
                isDown: false,
                lastDown: {
                    x: 0,
                    y: 0
                }
            },
            grid: {
                x: 0,
                y: 0,
                space: 100
            }
        }
    };

    //
    // REFS
    //
    const svg = qs("svg");

    //
    // RENDER
    //
    function render(s) {

        const {
            minx: mx,
            miny: my,
            width: vw,
            height: vh,
        } = s.data.viewBox;
        
        svg.setAttribute(
            "viewBox", 
            `${mx} ${my} ${vw} ${vh}`
        );

        setStyleVar("--space", state.data.grid.space);
        setStyleVar("--offset-x", state.data.grid.x);
        setStyleVar("--offset-y", state.data.grid.y);

        // If new state nodes are present, create svg nodes for them

        // If svg nodes are present without state nodes, delete them

        // Position and style svg nodes according to state


        requestAnimationFrame(() => render(state));
    }
    requestAnimationFrame(() => render(state));

    //
    // EVENTS
    //
    svg.addEventListener("wheel", e => {
        const dir = (e.deltaY > 0) ? 1 : -1;        
        const { aspectRatio, pixelRatio } = state.data;
        const { width, height } = state.data.viewBox;
        
        const amountX = dir * state.data.zoomStep;
        const amountY = amountX / aspectRatio;

        state.data.viewBox.width = width + amountX;
        state.data.viewBox.height = height + amountY;
        
        state.data.pixelRatio = state.data.viewBox.width / pageWidth;
        const newspace = 100 / state.data.pixelRatio;
        const gridShrinkX = state.data.grid.space - newspace;
        const gridShrinkY = gridShrinkX / aspectRatio;
        state.data.grid.space = newspace;

        const { minx, miny } = state.data.viewBox;
        const xpercent = state.data.mouse.pos.x / pageWidth;
        const ypercent = state.data.mouse.pos.y / pageHeight;
        state.data.viewBox.minx = minx + (-1 * amountX) * xpercent;
        state.data.viewBox.miny = miny + (-1 * amountY) * ypercent;
        state.data.grid.x -= gridShrinkX;
        state.data.grid.y -= gridShrinkY;
    });
    svg.addEventListener("mousemove", e => {
        const pos = {
            x: e.clientX,
            y: e.clientY
        };

        if (state.data.mouse.isDown) {
            const delta = subv(
                state.data.mouse.pos,
                pos
            );

            const { minx, miny } = state.data.viewBox;
            const { pixelRatio } = state.data;
            state.data.viewBox.minx = minx + delta.x * pixelRatio;
            state.data.viewBox.miny = miny + delta.y * pixelRatio;
            state.data.grid.x -= delta.x;
            state.data.grid.y -= delta.y;
        }
        
        state.data.mouse.pos = pos;
    });
    svg.addEventListener("mousedown", e => {
        state.data.mouse.isDown = true;
    });
    svg.addEventListener("mouseup", e => {
        state.data.mouse.isDown = false;
    });

})();