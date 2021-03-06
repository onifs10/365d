import Matter, { Runner } from "matter-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@blueprintjs/core";
import { NextPage } from "next";
import Styles from "../styles/001.module.scss";
import Paper from "../components/Paper";

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
const Paper001: NextPage = (Props) => {
  //====  states =====//
  const divRef = useRef<HTMLDivElement | null>(null);
  const renderRef = useRef<Matter.Render>();
  const [running, setRuning] = useState<boolean>(true);
  const runnerRef = useRef<Matter.Runner>(Runner.create());
  const [reset, setReset] = useState<boolean>(true);

  // actions to be called by user interaction
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reset] // i added this so has to trigger re-render to reset canvas
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
      //add slab 1
      const ground = Bodies.rectangle(300, 300, 400, 20, {
        isStatic: true,
        render: { ...wireframe },
      });

      const RightGuard = Bodies.rectangle(399, 90, 20, 400, {
        isStatic: true,
        render: { ...wireframe, fillStyle: "lightgreen" },
      });

      World.add(engine.world, [ground, RightGuard]);

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

      //sample box
      const boxA = Bodies.rectangle(200, 200, 30, 30, {
        render: { ...wireframe, fillStyle: "green" },
      });
      World.add(engine.world, [boxA]);

      actions.add = (event) => {
        let { x, y } = event.source.mouse.absolute;
        const boxA = Bodies.rectangle(x, y, 30, 30, {
          render: { ...wireframe, fillStyle: "lightgreen" },
        });
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
    <>
      <Paper
        pageTitle="Day 001 Stack-Up"
        pageDescription="Day One Exploring js -- Using Matterjs"
        paperTitle="Stack Up"
        paperTip="Click inside the bigger box to drop boxes and stack them up"
      >
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
      </Paper>
    </>
  );
};

export default Paper001;
