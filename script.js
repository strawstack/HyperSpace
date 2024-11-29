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
        const { aspectRatio } = state.data;
        const { width, height } = state.data.viewBox;
        
        const amountX = dir * state.data.zoomStep;
        const amountY = amountX / aspectRatio;

        state.data.viewBox.width = width + amountX;
        state.data.viewBox.height = height + amountY;

        const { minx, miny } = state.data.viewBox;
        const xpercent = state.data.mouse.pos.x / pageWidth;
        const ypercent = state.data.mouse.pos.y / pageHeight;
        state.data.viewBox.minx = minx + (-1 * amountX) * xpercent;
        state.data.viewBox.miny = miny + (-1 * amountY) * ypercent;

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

            const pixelRatio = state.data.viewBox.width / pageWidth;

            const { minx, miny } = state.data.viewBox;
            state.data.viewBox.minx = minx + delta.x * pixelRatio;
            state.data.viewBox.miny = miny + delta.y * pixelRatio;
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