import { NextPage } from "next";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Styles from "../styles/001.module.scss";
import { Button } from "@blueprintjs/core";
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
  const renderRef = useRef<Matter.Render>();
  const [running, setRuning] = useState<boolean>(true);
  const runnerRef = useRef<Matter.Runner>(Runner.create());
  const [reset, setReset] = useState<boolean>(true);
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
    [reset]
  );

  useEffect(() => {
    // create a renderer
    if (divRef.current) {
      // create and engine
      const engine = Engine.create();

      divRef.current.innerHTML = "";
      renderRef.current = Render.create({
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
      Runner.start(runnerRef.current, engine);

      // run the renderer
      Render.run(renderRef.current);

      //create a mouse for the div
      var mouse = Mouse.create(renderRef.current.element);

      //create a mouseConstarint for user interaction
      var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });

      const boxA = Bodies.rectangle(200, 200, 30, 30, { render: wireframe });
      World.add(engine.world, [boxA]);

      actions.add = (event) => {
        let { x, y } = event.source.mouse.absolute;
        const boxA = Bodies.rectangle(x, y, 30, 30, { render: wireframe });
        World.add(engine.world, [boxA]);
      };

      Composite.add(engine.world, mouseConstraint);

      //register mouse down event to the mouse constraint
      Events.on(mouseConstraint, "mousedown", actions.add);

      renderRef.current.mouse = mouse;

      return () => {
        Events.off(mouseConstraint, "mousedown", actions.add);
      };
    }
  }, [divRef, wireframe, actions]);

  const pauseEngine = () => {
    if (runnerRef.current) {
      runnerRef.current.enabled = !running;
      setRuning((value) => !value);
    }
  };

  const resetEngine = () => {
    runnerRef.current.enabled = true;
    setRuning(true);
    setReset((value) => !value);
  };

  return (
    <div className={Styles.pageWrapper}>
      <div ref={divRef} className={Styles.box} />
      <div className={Styles.tools}>
        <Button
          icon={running ? "pause" : "play"}
          intent="primary"
          text={running ? "Pause" : "Play"}
          className={Styles.toolButton}
          onClick={pauseEngine}
        />
        <Button
          icon="reset"
          intent="danger"
          text={"Reset"}
          className={Styles.toolButton}
          onClick={resetEngine}
        />
      </div>
    </div>
  );
};

export default Day001;
