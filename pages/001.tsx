import { NextPage } from "next";
import { MouseEvent, useEffect, useMemo, useRef } from "react";
import Styles from "../styles/001.module.scss";
import Matter, { Runner } from "matter-js";

const {
  Engine,
  Render,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
  Composite,
  Events,
} = Matter;
const Day001: NextPage = () => {
  //====  states =====//
  const divRef = useRef<HTMLDivElement | null>(null);
  // actions to be called in this Componen
  const actions = useMemo(
    () => ({
      add: (event: Matter.IMouseEvent<Matter.MouseConstraint>) => {},
    }),
    []
  );
  //shapes wireframes
  const wireframe = useMemo(
    () => ({
      fillStyle: "transparent",
      strokeStyle: "green",
      lineWidth: 2,
    }),
    []
  );
  // create and engine
  const engine = Engine.create();

  actions.add = (event) => {
    let { x, y } = event.source.mouse.absolute;
    const boxA = Bodies.rectangle(x, y, 30, 30, { render: wireframe });
    World.add(engine.world, [boxA]);
  };

  useEffect(() => {
    // create a renderer
    if (divRef.current) {
      divRef.current.innerHTML = "";
      const render = Render.create({
        element: divRef.current,
        engine: engine,
        options: {
          width: 400,
          height: 400,
          background: "#ffffff",
          wireframes: false,
        },
      });
      //add slab
      const ground = Bodies.rectangle(300, 300, 400, 20, {
        isStatic: true,
        render: { ...wireframe },
      });

      World.add(engine.world, [ground]);
      // run the engine
      Runner.run(engine);

      // run the renderer
      Render.run(render);

      //create a mouse for the div
      var mouse = Mouse.create(render.element);

      //create a mouseConstarint for user interaction
      var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });

      //   let { x, y } = event.source.mouse.absolute;
      const boxA = Bodies.rectangle(200, 200, 30, 30, { render: wireframe });
      World.add(engine.world, [boxA]);

      Composite.add(engine.world, mouseConstraint);

      //register mouse down event to the mouse constraint
      Events.on(mouseConstraint, "mousedown", actions.add);

      render.mouse = mouse;
      return () => {
        Events.off(mouseConstraint, "mousedown", actions.add);
      };
    }
  }, [divRef, engine, wireframe, actions]);

  return <div ref={divRef} className={Styles.box}></div>;
};

export default Day001;
